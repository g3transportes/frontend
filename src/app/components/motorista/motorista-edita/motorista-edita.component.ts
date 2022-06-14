import { Component, OnInit, Input } from '@angular/core';
import { DialogService, DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Motorista } from 'src/app/models/motorista.model';
import { Loading } from 'src/app/helpers/loading.helper';
import { MotoristaService } from 'src/app/services/motorista.service';
import { DialogServiceHelper } from 'src/app/services/dialog.service';
import { DialogTypeEnum } from 'src/app/enums/dialog-type.enum';
import { ListResult } from 'src/app/helpers/list-result.helper';
import { Anexo } from 'src/app/models/anexo.model';
import { MotoristaAnexoService } from 'src/app/services/motorista-anexo.service';
import { MotoristaAnexoFilter } from 'src/app/filters/motorista-anexo.filter';
import { AnexoUploadComponent } from '../../anexo/anexo-upload/anexo-upload.component';
import { MotoristaAnexo } from 'src/app/models/motorista-anexo.model';
import { CommonHelper } from 'src/app/helpers/common.helper';

@Component({
	selector: 'app-motorista-edita',
	templateUrl: './motorista-edita.component.html',
	styleUrls: ['./motorista-edita.component.css'],
	providers: [ DialogService ]
})
export class MotoristaEditaComponent implements OnInit 
{
	@Input() public id: number;
	public vm: Motorista = new Motorista();
	public anexos: ListResult<Anexo> = new ListResult<Anexo>();
	public confirmaSenha: string = '';
	public loading: Loading = new Loading();
	public localeBR: any;

	constructor(private motoristaService: MotoristaService, 
		private motoristaAnexoService: MotoristaAnexoService,
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
	}

	private carregaItem(): void
	{
		if(this.id != 0)
		{
			this.loading.Status = true

			this.motoristaService
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
			this.vm = new Motorista();
		}
	}

	private formataDatas(): void
	{
		//resolve probelmas de data
		if(this.vm.DataHabilitacao)
			this.vm.DataHabilitacao = CommonHelper.setDate(this.vm.DataHabilitacao);

		if(this.vm.DataVencimento)
			this.vm.DataVencimento = CommonHelper.setDate(this.vm.DataVencimento);
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

			this.motoristaService
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
			
			this.motoristaService
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
			let filtro = new MotoristaAnexoFilter();
			filtro.MotoristaFilter = true;
			filtro.MotoristaValue = this.vm.Id;

			this.loading.Status = true

			this.motoristaAnexoService
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
			let lista = new Array<MotoristaAnexo>();

			//carre a lista
			this.anexos.Items.forEach((value, index, result) => 
			{
				let item = new MotoristaAnexo();
				item.IdMotorista = this.vm.Id;
				item.IdAnexo = value.Id;
				item.Data = CommonHelper.getToday();

				lista.push(item);
			});

			//adiciona registro
			this.loading.Status = true;

			this.motoristaAnexoService
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

	private deletaAnexo(item: MotoristaAnexo): void
	{
		this.loading.Status = true;

		this.motoristaAnexoService
			.deleta(item.IdMotorista, item.IdAnexo)
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

	public onDeletaAnexo_Click(item: MotoristaAnexo): void
	{
		let title = 'Confirmação de exclusão';
		let message = 'Tem certeza que deseja excluir o registro ' + item.Anexo.Nome + '?'
		
		this.dialogService.confirm(title, message, () => 
		{
			this.deletaAnexo(item);
		}, null);
	}

}
