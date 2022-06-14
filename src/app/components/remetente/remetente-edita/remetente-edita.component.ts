import { Component, OnInit, Input } from '@angular/core';
import { DialogService, DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Remetente } from 'src/app/models/remetente.model';
import { Loading } from 'src/app/helpers/loading.helper';
import { RemetenteService } from 'src/app/services/remetente.service';
import { DialogServiceHelper } from 'src/app/services/dialog.service';
import { DialogTypeEnum } from 'src/app/enums/dialog-type.enum';
import { ListResult } from 'src/app/helpers/list-result.helper';
import { Anexo } from 'src/app/models/anexo.model';
import { RemetenteAnexoService } from 'src/app/services/remetente-anexo.service';
import { RemetenteAnexo } from 'src/app/models/remetente-anexo.model';
import { RemetenteAnexoFilter } from 'src/app/filters/remetente-anexo.filter';
import { AnexoUploadComponent } from '../../anexo/anexo-upload/anexo-upload.component';
import { CommonHelper } from 'src/app/helpers/common.helper';
import { SelectItem } from 'primeng/api/selectitem';
import { EstadoService } from 'src/app/services/estado.service';
import { EstoqueEditaComponent } from '../../estoque/estoque-edita/estoque-edita.component';
import { RemetenteEstoque } from 'src/app/models/remetente-estoque.model';

@Component({
	selector: 'app-remetente-edita',
	templateUrl: './remetente-edita.component.html',
	styleUrls: ['./remetente-edita.component.css'],
	providers: [ DialogService ]
})
export class RemetenteEditaComponent implements OnInit 
{
	@Input() public id: number;
	public vm: Remetente = new Remetente();
	public anexos: ListResult<Anexo> = new ListResult<Anexo>();
	public estados: SelectItem[];
	public cidades: SelectItem[];
	public loading: Loading = new Loading();

	constructor(private remetenteService: RemetenteService, 
		private remetenteAnexoService: RemetenteAnexoService,
		private estadoService: EstadoService,
		private modalService: DialogService,
		private dialogService: DialogServiceHelper, 
		private ref: DynamicDialogRef, 
		private config: DynamicDialogConfig) 
	{ 

	}

	ngOnInit() 
	{
		this.inicializa();
	}

	private inicializa(): void
	{
		//verifica id
		this.id = this.config.data.id;
		
		//carrega item
		this.carregaItem();
		this.carregaEstados();
		this.carregaCidades();
	}

	private carregaItem(): void
	{
		if(this.id != 0)
		{
			this.loading.Status = true

			this.remetenteService
				.pegaItem(this.id)
				.then((result) => 
			{
				if(result.IsValid)
				{
					this.vm = result.Item;
					this.formataDatas();
				}
				else
				{
					this.dialogService.alert('Erro ao carregar os dados', result.Errors, DialogTypeEnum.Erro, null);
				}
			})
			.catch((error) => 
			{
				this.dialogService.alert('Erro ao carregar os dados', [ error ], DialogTypeEnum.Erro, null);
			})
			.finally(() => 
			{
				this.loading.Status = false;
				this.carregaAnexos();
			});
		}
		else
		{
			this.vm = new Remetente();
		}
	}

	private carregaEstados(): void
	{
		//inicializa o loading
		this.loading.Status = true;

		//executa consulta
		this.estadoService
			.pegaLista()
			.then((result) => 
			{
				if(result.IsValid)
				{
					this.estados = new Array<SelectItem>();
					this.estados.push({ label: 'Nenhum estado selecionado', value: '' });

					result.Items.forEach((item, index, array) => 
					{
						this.estados.push({ label: item.Nome, value: item.Sigla });
					})
				}
				else
				{
					this.dialogService.alert('Erro ao carregar os dados', result.Errors, DialogTypeEnum.Erro, null);
				}
			})
			.catch((error) => 
			{
				this.dialogService.alert('Erro ao carregar os dados', [ error ], DialogTypeEnum.Erro, null);
			})
			.finally(() => 
			{
				this.loading.Status = false;
			});
	}

	private carregaCidades(): void
	{
		if(this.vm.EndEstado != '')
		{
			//inicializa o loading
			this.loading.Status = true;

			//executa consulta
			this.estadoService
				.pegaItem(this.vm.EndEstado)
				.then((result) => 
				{
					if(result.IsValid)
					{
						this.cidades = new Array<SelectItem>();
						this.cidades.push({ label: 'Nenhuma cidade selecionada', value: '' });

						result.Item.Cidades.forEach((item, index, array) => 
						{
							this.cidades.push({ label: item, value: item });
						});

						//verifica se tem item na lista
						if(result.Item.Cidades.indexOf(this.vm.EndCidade) == -1)
							this.vm.EndCidade = result.Item.Cidades[0];
					}
					else
					{
						this.dialogService.alert('Erro ao carregar os dados', result.Errors, DialogTypeEnum.Erro, null);
					}
				})
				.catch((error) => 
				{
					this.dialogService.alert('Erro ao carregar os dados', [ error ], DialogTypeEnum.Erro, null);
				})
				.finally(() => 
				{
					this.loading.Status = false;
				});
		}
		else
		{
			this.cidades = new Array<SelectItem>();
			this.cidades.push({ label: 'Nenhuma cidade selecionada', value: '' });
		}
		
	}

	private formataDatas(): void
	{
		//resolve probelmas de data
		
	}

	private valida(): boolean
	{
		let isValid = true;
		let errors = new Array<string>();

		if(!this.vm.NomeFantasia && !this.vm.RazaoSocial)
		{
			isValid = false;
			errors.push('Informe a razão social ou nome fantasia');
		}

		if(this.vm.Email)
		{
			let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			
			if(!re.test(this.vm.Email))
			{
				isValid = false;
				errors.push("Email informado é inválido.");
			}
		}

		if(isValid == false)
		{
			this.dialogService.alert('Erro ao validar o formulário', errors, DialogTypeEnum.Warning , null);
		}

		return isValid;
	}

	private insere(): void
	{
		if(this.valida())
		{
			this.loading.Status = true;

			this.remetenteService
				.insere(this.vm)
				.then((result) => 
				{
					if(result.IsValid)
					{
						this.vm = result.Item;
						this.formataDatas();
						this.insereAnexos();

						this.dialogService.alert('Informações do sistema', ['Dados incluídos com sucesso'], DialogTypeEnum.Sucesso, () => 
						{
							this.ref.close(this.vm);
						});
					}
					else
					{
						this.dialogService.alert('Erro ao salvar os dados', result.Errors, DialogTypeEnum.Erro, null);
					}
				})
				.catch((error) => 
				{
					this.dialogService.alert('Erro ao salvar os dados', [error], DialogTypeEnum.Erro, null);
				})
				.finally(() => 
				{
					this.loading.Status = false;
				})
		}
		
	}

	private atualiza(): void
	{
		if(this.valida())
		{
			this.loading.Status = true;
			
			this.remetenteService
				.atualiza(this.vm)
				.then((result) => 
				{
					if(result.IsValid)
					{
						this.vm = result.Item;
						this.formataDatas();
						
						this.dialogService.alert('Informações do sistema', ['Dados atualizados com sucesso'], DialogTypeEnum.Sucesso, () => 
						{
							this.ref.close(this.vm);
						});
					}
					else
					{
						this.dialogService.alert('Erro ao salvar os dados', result.Errors, DialogTypeEnum.Erro, null);
					}
				})
				.catch((error) => 
				{
					this.dialogService.alert('Erro ao salvar os dados', [error], DialogTypeEnum.Erro, null);
				})
				.finally(() => 
				{
					this.loading.Status = false;
					this.loading.Text = '';
				})
		}
		
	}

	private carregaAnexos(): void
	{
		if(this.vm.Id != 0)
		{
			let filtro = new RemetenteAnexoFilter();
			filtro.RemetenteFilter = true;
			filtro.RemetenteValue = this.vm.Id;

			this.loading.Status = true

			this.remetenteAnexoService
				.pegaLista(filtro, 1, 1000)
				.then((result) => 
			{
				if(result.IsValid)
				{
					this.vm.Anexos = result.Items;
				}
				else
				{
					this.dialogService.alert('Erro ao carregar os dados', result.Errors, DialogTypeEnum.Erro, null);
				}
			})
			.catch((error) => 
			{
				this.dialogService.alert('Erro ao carregar os dados', [ error ], DialogTypeEnum.Erro, null);
			})
			.finally(() => 
			{
				this.loading.Status = false;
			});
		}
	}
	
	private adicionaAnexo(): void
	{
		let title = 'Enviar Arquivo';
		let data = 
		{
			id: 0
		};

		const ref = this.modalService.open(AnexoUploadComponent, 
		{
			header: title,
			data: data,
			width: '40%'
		});

		ref.onClose.subscribe((result: ListResult<Anexo>) => 
		{
			if(result != null)
			{
				if(result.IsValid)
				{
					this.anexos = result;
					this.insereAnexos();
				}
			}
		});
	}

	private insereAnexos(): void
	{
		if(this.vm.Id != 0 && this.anexos.Items.length > 0)
		{
			//cria objetos
			let lista = new Array<RemetenteAnexo>();

			//carre a lista
			this.anexos.Items.forEach((value, index, result) => 
			{
				let item = new RemetenteAnexo();
				item.IdRemetente = this.vm.Id;
				item.IdAnexo = value.Id;
				item.Data = CommonHelper.getToday();

				lista.push(item);
			});

			//adiciona registro
			this.loading.Status = true;

			this.remetenteAnexoService
				.insereVarios(lista)
				.then((result) => 
				{
					if(result.IsValid)
					{
						this.anexos = new ListResult<Anexo>();
						this.carregaAnexos();
					}
					else
					{
						this.dialogService.alert('Erro ao salvar os dados', result.Errors, DialogTypeEnum.Erro, null);
					}
				})
				.catch((error) => 
				{
					this.dialogService.alert('Erro ao salvar os dados', [error], DialogTypeEnum.Erro, null);
				})
				.finally(() => 
				{
					this.loading.Status = false;
				});
		}
		else
		{
			if(this.vm.Id == 0)
				this.insere();
		}
	}

	private deletaAnexo(item: RemetenteAnexo): void
	{
		this.loading.Status = true;

		this.remetenteAnexoService
			.deleta(item.IdRemetente, item.IdAnexo)
			.then((result) => 
			{
				if(result.IsValid)
				{
					this.carregaAnexos();
				}
				else
				{
					this.dialogService.alert('Erro ao excluir os dados', result.Errors, DialogTypeEnum.Erro, null);
				}
			})
			.catch((error) => 
			{
				this.dialogService.alert('Erro ao excluir os dados', [ error ], DialogTypeEnum.Erro, null);
			})
			.finally(() => 
			{
				this.loading.Status = false;
			});
	}

	private adicionaEstoque(): void
	{
		let title = 'Novo Registro';
		let data = 
		{
			id: 0
		};

		const ref = this.modalService.open(EstoqueEditaComponent, 
		{
			header: title,
			data: data,
			width: '60%'
		});

		ref.onClose.subscribe((result: RemetenteEstoque) => 
		{
			if(result != null)
			{
				this.carregaItem();
			}
		});
	}

	public onEstado_Change(): void
	{
		this.carregaCidades();
	}

	public onSalvar_Click(): void
	{
		if(this.vm.Id == 0)
			this.insere();
		else
			this.atualiza();
	}

	public onAdicionaAnexo_Click(): void
	{
		this.adicionaAnexo();
	}

	public onDeletaAnexo_Click(item: RemetenteAnexo): void
	{
		let title = 'Confirmação de exclusão';
		let message = 'Tem certeza que deseja excluir o registro ' + item.Anexo.Nome + '?'
		
		this.dialogService.confirm(title, message, () => 
		{
			this.deletaAnexo(item);
		}, null);
	}

	public onAdicionaEstoque_Click(): void
	{
		this.adicionaEstoque();
	}
}
