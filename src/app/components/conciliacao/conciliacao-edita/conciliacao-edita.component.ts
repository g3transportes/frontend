import { Component, OnInit, Input } from '@angular/core';
import { DialogService, DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Conciliacao } from 'src/app/models/conciliacao.model';
import { ListResult } from 'src/app/helpers/list-result.helper';
import { SelectItem } from 'primeng/api';
import { Loading } from 'src/app/helpers/loading.helper';
import { ConciliacaoService } from 'src/app/services/conciliacao.service';
import { ContaBancariaService } from 'src/app/services/conta-bancaria.service';
import { DialogServiceHelper } from 'src/app/services/dialog.service';
import { DialogTypeEnum } from 'src/app/enums/dialog-type.enum';
import { CommonHelper } from 'src/app/helpers/common.helper';
import { AnexoUploadComponent } from '../../anexo/anexo-upload/anexo-upload.component';
import { Anexo } from 'src/app/models/anexo.model';

@Component({
	selector: 'app-conciliacao-edita',
	templateUrl: './conciliacao-edita.component.html',
	styleUrls: ['./conciliacao-edita.component.css'],
	providers: [ DialogService ]
})
export class ConciliacaoEditaComponent implements OnInit 
{
	@Input() public id: number;
	public vm: Conciliacao = new Conciliacao();
	public contas: SelectItem[];
	public loading: Loading = new Loading();
	public localeBR: any;

	constructor(private conciliacaoService: ConciliacaoService, 
		private contaBancariaService: ContaBancariaService,
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

		//inicializa locale
		this.localeBR = CommonHelper.calendarLocale();
		
		//carrega item
		this.carregaContasBancarias();
		this.carregaItem();
	}

	private carregaContasBancarias(): void
	{
		//inicializa o loading
		this.loading.Status = true;

		//executa consulta
		this.contaBancariaService
			.pegaLista()
			.then((result) => 
			{
				if(result.IsValid)
				{
					this.contas = new Array<SelectItem>();
					this.contas.push({ label: 'Nenhum', value: null });

					result.Items.forEach((item, index, array) => 
					{
						this.contas.push({ label: item.Nome, value: item.Id });
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

	private carregaItem(): void
	{
		if(this.id != 0)
		{
			this.loading.Status = true

			this.conciliacaoService
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
			});
		}
		else
		{
			this.vm = new Conciliacao();
		}
	}

	private formataDatas(): void
	{
		//resolve probelmas de data
		this.vm.Data = CommonHelper.setDate(this.vm.Data);
	}

	private valida(): boolean
	{
		let isValid = true;
		let errors = new Array<string>();

		if(!this.vm.IdConta)
		{
			isValid = false;
			errors.push('Informe uma conta');
		}

		if(!this.vm.Data)
		{
			isValid = false;
			errors.push('Informe a data');
		}

		if(this.vm.Saldo == null || this.vm.Saldo == undefined)
		{
			isValid = false;
			errors.push('Informe o saldo');
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

			this.conciliacaoService
				.insere(this.vm)
				.then((result) => 
				{
					if(result.IsValid)
					{
						this.vm = result.Item;
						this.formataDatas();

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
			
			this.conciliacaoService
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
					if(result.Items.length > 0)
					{
						this.vm.Anexo = result.Items[0].Arquivo;

						if(this.vm.Id != 0)
						{
							this.atualiza();
						}
					}
						
					

				}
			}
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
}
