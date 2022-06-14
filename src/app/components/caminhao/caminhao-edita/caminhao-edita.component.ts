import { Component, OnInit, Input } from '@angular/core';
import { Caminhao } from 'src/app/models/caminhao.model';
import { Loading } from 'src/app/helpers/loading.helper';
import { SelectItem } from 'primeng/api/selectitem';
import { CaminhaoService } from 'src/app/services/caminhao.service';
import { DialogServiceHelper } from 'src/app/services/dialog.service';
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import { MotoristaFilter } from 'src/app/filters/motorista.filter';
import { MotoristaService } from 'src/app/services/motorista.service';
import { DialogTypeEnum } from 'src/app/enums/dialog-type.enum';
import { MotoristaEditaComponent } from '../../motorista/motorista-edita/motorista-edita.component';
import { Motorista } from 'src/app/models/motorista.model';
import { AnexoUploadComponent } from '../../anexo/anexo-upload/anexo-upload.component';
import { ListResult } from 'src/app/helpers/list-result.helper';
import { Anexo } from 'src/app/models/anexo.model';
import { CaminhaoAnexo } from 'src/app/models/caminhao-anexo.model';
import { CaminhaoAnexoService } from 'src/app/services/caminhao-anexo.service';
import { CaminhaoAnexoFilter } from 'src/app/filters/caminhao-anexo.filter';
import { CommonHelper } from 'src/app/helpers/common.helper';
import { ProprietarioService } from 'src/app/services/proprietario.service';
import { EstadoService } from 'src/app/services/estado.service';
import { ProprietarioFilter } from 'src/app/filters/proprietario.filter';
import { ProprietarioEditaComponent } from '../../proprietario/proprietario-edita/proprietario-edita.component';
import { Proprietario } from 'src/app/models/proprietario.model';

@Component({
	selector: 'app-caminhao-edita',
	templateUrl: './caminhao-edita.component.html',
	styleUrls: ['./caminhao-edita.component.css'],
	providers: [ DialogService ]
})
export class CaminhaoEditaComponent implements OnInit 
{
	@Input() public id: number;
	public vm: Caminhao = new Caminhao();
	public anexos: ListResult<Anexo> = new ListResult<Anexo>();
	public motoristas: SelectItem[];
	public proprietarios: SelectItem[];
	public estados: SelectItem[];
	public cidades: SelectItem[];
	public loading: Loading = new Loading();

	constructor(private caminhaoService: CaminhaoService, 
		private caminhaoAnexoService: CaminhaoAnexoService,
		private motoristaService: MotoristaService,
		private estadoService: EstadoService,
		private proprietarioService: ProprietarioService,
		private dialogService: DialogServiceHelper, 
		private modalService: DialogService,
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
		this.carregaMotoristas();
		this.carregaProprietarios();
		this.carregaEstados();
		this.carregaCidades();
		this.carregaItem();
	}

	private carregaMotoristas(): void
	{
		//inicializa o loading
		this.loading.Status = true;

		//filtro
		let filter = new MotoristaFilter();
		filter.AtivoFilter = true;
		filter.AtivoValue = true;
		
		//executa consulta
		this.motoristaService
			.pegaLista(filter, 1, 10000)
			.then((result) => 
			{
				if(result.IsValid)
				{
					this.motoristas = new Array<SelectItem>();
					this.motoristas.push({ label: 'Nenhum motorista selecionado', value: null });

					result.Items.forEach((item, index, array) => 
					{
						this.motoristas.push({ label: item.Nome + ' - ' + item.Documento1, value: item.Id });
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

	private carregaProprietarios(): void
	{
		//inicializa o loading
		this.loading.Status = true;

		//filtro
		let filter = new ProprietarioFilter();
		filter.AtivoFilter = true;
		filter.AtivoValue = true;
		
		//executa consulta
		this.proprietarioService
			.pegaLista(filter, 1, 10000)
			.then((result) => 
			{
				if(result.IsValid)
				{
					this.proprietarios = new Array<SelectItem>();
					this.proprietarios.push({ label: 'Nenhum proprietário selecionado', value: null });

					result.Items.forEach((item, index, array) => 
					{
						this.proprietarios.push({ label: item.Nome + ' - ' + item.Documento, value: item.Id });
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
		if(this.vm.Estado != '')
		{
			//inicializa o loading
			this.loading.Status = true;

			//executa consulta
			this.estadoService
				.pegaItem(this.vm.Estado)
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
						if(result.Item.Cidades.indexOf(this.vm.Cidade) == -1)
							this.vm.Cidade = result.Item.Cidades[0];
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

	private carregaItem(): void
	{
		if(this.id != 0)
		{
			this.loading.Status = true

			this.caminhaoService
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
			this.vm = new Caminhao();
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

		if(!this.vm.Placa)
		{
			isValid = false;
			errors.push('Informe um placa para o caminhão');
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

			this.caminhaoService
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
			
			this.caminhaoService
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

	private adicionaMotorista(): void
	{
		let title = 'Novo Motorista';
		let data = 
		{
			id: 0
		};

		const ref = this.modalService.open(MotoristaEditaComponent, 
		{
			header: title,
			data: data,
			width: '60%'
		});

		ref.onClose.subscribe((result: Motorista) => 
		{
			if(result != null)
			{
				this.carregaMotoristas();
				this.vm.IdMotorista = result.Id;
			}
		});
	}

	private adicionaProprietario(): void
	{
		let title = 'Novo Proprietário';
		let data = 
		{
			id: 0
		};

		const ref = this.modalService.open(ProprietarioEditaComponent, 
		{
			header: title,
			data: data,
			width: '60%'
		});

		ref.onClose.subscribe((result: Proprietario) => 
		{
			if(result != null)
			{
				this.carregaProprietarios();
				this.vm.IdProprietario = result.Id;
			}
		});
	}

	
	private carregaAnexos(): void
	{
		if(this.vm.Id != 0)
		{
			let filtro = new CaminhaoAnexoFilter();
			filtro.CaminhaoFilter = true;
			filtro.CaminhaoValue = this.vm.Id;

			this.loading.Status = true

			this.caminhaoAnexoService
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
			let lista = new Array<CaminhaoAnexo>();

			//carre a lista
			this.anexos.Items.forEach((value, index, result) => 
			{
				let item = new CaminhaoAnexo();
				item.IdCaminhao = this.vm.Id;
				item.IdAnexo = value.Id;
				item.Data = CommonHelper.getToday();

				lista.push(item);
			});

			//adiciona registro
			this.loading.Status = true;

			this.caminhaoAnexoService
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
				})
		}
		else
		{
			if(this.vm.Id == 0)
				this.insere();
		}
	}

	private deletaAnexo(item: CaminhaoAnexo): void
	{
		this.loading.Status = true;

		this.caminhaoAnexoService
			.deleta(item.IdCaminhao, item.IdAnexo)
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

	public onAdicionaMotorista_Click(): void
	{
		this.adicionaMotorista();
	}

	public onAdicionaProprietario_Click(): void
	{
		this.adicionaProprietario();
	}

	public onAdicionaAnexo_Click(): void
	{
		this.adicionaAnexo();
	}

	public onDeletaAnexo_Click(item: CaminhaoAnexo): void
	{
		let title = 'Confirmação de exclusão';
		let message = 'Tem certeza que deseja excluir o registro ' + item.Anexo.Nome + '?'
		
		this.dialogService.confirm(title, message, () => 
		{
			this.deletaAnexo(item);
		}, null);
	}
}
