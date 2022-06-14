import { Component, OnInit, Input } from '@angular/core';
import { DialogService, DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Proprietario } from 'src/app/models/proprietario.model';
import { Loading } from 'src/app/helpers/loading.helper';
import { ProprietarioService } from 'src/app/services/proprietario.service';
import { DialogServiceHelper } from 'src/app/services/dialog.service';
import { DialogTypeEnum } from 'src/app/enums/dialog-type.enum';
import { ListResult } from 'src/app/helpers/list-result.helper';
import { Anexo } from 'src/app/models/anexo.model';
import { ProprietarioAnexoService } from 'src/app/services/proprietario-anexo.service';
import { ProprietarioAnexo } from 'src/app/models/proprietario-anexo.model';
import { ProprietarioAnexoFilter } from 'src/app/filters/proprietario-anexo.filter';
import { AnexoUploadComponent } from '../../anexo/anexo-upload/anexo-upload.component';
import { CommonHelper } from 'src/app/helpers/common.helper';
import { SelectItem } from 'primeng/api/selectitem';
import { EstadoService } from 'src/app/services/estado.service';

@Component({
	selector: 'app-proprietario-edita',
	templateUrl: './proprietario-edita.component.html',
	styleUrls: ['./proprietario-edita.component.css'],
	providers: [ DialogService ]
})
export class ProprietarioEditaComponent implements OnInit 
{
	@Input() public id: number;
	public vm: Proprietario = new Proprietario();
	public anexos: ListResult<Anexo> = new ListResult<Anexo>();
	public estados: SelectItem[];
	public cidades: SelectItem[];
	public loading: Loading = new Loading();
	public localeBR: any;

	constructor(private proprietarioService: ProprietarioService, 
		private proprietarioAnexoService: ProprietarioAnexoService,
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

		//inicializa locale
		this.localeBR = CommonHelper.calendarLocale();
		
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

			this.proprietarioService
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
			this.vm = new Proprietario();
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
		if(this.vm.AnttData)
			this.vm.AnttData = CommonHelper.setDate(this.vm.AnttData);
	}

	private valida(): boolean
	{
		let isValid = true;
		let errors = new Array<string>();

		if(!this.vm.Nome)
		{
			isValid = false;
			errors.push('Informe o nome');
		}

		if(!this.vm.Documento)
		{
			isValid = false;
			errors.push('Informe o CPF / CNPJ');
		}

		if(!this.vm.Antt)
		{
			isValid = false;
			errors.push('Informe o ANTT / RNTRC');
		}

		if(!this.vm.AnttData)
		{
			isValid = false;
			errors.push('Informe a data de vencimento ANTT');
		}

		if(!this.vm.EndCidade)
		{
			isValid = false;
			errors.push('Informe a cidade');
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

			this.proprietarioService
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
			
			this.proprietarioService
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
			let filtro = new ProprietarioAnexoFilter();
			filtro.ProprietarioFilter = true;
			filtro.ProprietarioValue = this.vm.Id;

			this.loading.Status = true

			this.proprietarioAnexoService
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
			let lista = new Array<ProprietarioAnexo>();

			//carre a lista
			this.anexos.Items.forEach((value, index, result) => 
			{
				let item = new ProprietarioAnexo();
				item.IdProprietario = this.vm.Id;
				item.IdAnexo = value.Id;
				item.Data = CommonHelper.getToday();

				lista.push(item);
			});

			//adiciona registro
			this.loading.Status = true;

			this.proprietarioAnexoService
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

	private deletaAnexo(item: ProprietarioAnexo): void
	{
		this.loading.Status = true;

		this.proprietarioAnexoService
			.deleta(item.IdProprietario, item.IdAnexo)
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

	public onDeletaAnexo_Click(item: ProprietarioAnexo): void
	{
		let title = 'Confirmação de exclusão';
		let message = 'Tem certeza que deseja excluir o registro ' + item.Anexo.Nome + '?'
		
		this.dialogService.confirm(title, message, () => 
		{
			this.deletaAnexo(item);
		}, null);
	}
}