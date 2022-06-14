import { Component, OnInit, Input } from '@angular/core';
import { Lancamento } from 'src/app/models/lancamento.model';
import { Loading } from 'src/app/helpers/loading.helper';
import { LancamentoService } from 'src/app/services/lancamento.service';
import { DialogServiceHelper } from 'src/app/services/dialog.service';
import { DialogService, DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog/';
import { CommonHelper } from 'src/app/helpers/common.helper';
import { DialogTypeEnum } from 'src/app/enums/dialog-type.enum';
import { LancamentoBaixa } from 'src/app/models/lancamento-baixa.model';
import { LancamentoBaixaService } from 'src/app/services/lancamento-baixa.service';
import { SelectItem } from 'primeng/api/selectitem';
import { FormaPagamentoService } from 'src/app/services/forma-pagamento.service';
import { ContaBancariaService } from 'src/app/services/conta-bancaria.service';

@Component({
	selector: 'app-lancamento-baixa',
	templateUrl: './lancamento-baixa.component.html',
	styleUrls: ['./lancamento-baixa.component.css']
})
export class LancamentoBaixaComponent implements OnInit 
{
	@Input() public id: number;
	@Input() public idLancamento: number;
	public vm: LancamentoBaixa = new LancamentoBaixa();
	public lancamento: Lancamento = new Lancamento();
	public formasPagamento: SelectItem[];
	public contasBancarias: SelectItem[];
	public loading: Loading = new Loading();
	public localeBR: any;

	constructor(private lancamentoService: LancamentoService,
		private lancamentoBaixaService: LancamentoBaixaService, 
		private formaPagamentoService: FormaPagamentoService,
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
		this.idLancamento = this.config.data.idLancamento;

		//inicializa locale
		this.localeBR = CommonHelper.calendarLocale();
		
		//carrega item
		this.carregaFormasPagamento();
		this.carregaContasBancarias();
		this.carregaItem();
	}

	private carregaFormasPagamento(): void
	{
		//inicializa o loading
		this.loading.Status = true;

		//executa consulta
		this.formaPagamentoService
			.pegaLista()
			.then((result) => 
			{
				if(result.IsValid)
				{
					this.formasPagamento = new Array<SelectItem>();
					this.formasPagamento.push({ label: 'Nenhum', value: 0 });

					result.Items.forEach((item, index, array) => 
					{
						this.formasPagamento.push({ label: item.Nome, value: item.Id });
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
					this.contasBancarias = new Array<SelectItem>();
					this.contasBancarias.push({ label: 'Nenhum', value: null });

					result.Items.forEach((item, index, array) => 
					{
						this.contasBancarias.push({ label: item.Nome, value: item.Id });
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

			this.lancamentoBaixaService
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
					this.carregaLancamento()
				});
		}
		else
		{
			this.vm = new LancamentoBaixa();
			this.carregaLancamento();
		}
	}

	private carregaLancamento(): void
	{
		this.loading.Status = true

		this.lancamentoService
			.pegaItem(this.idLancamento)
			.then((result) => 
			{
				if(result.IsValid)
				{
					this.lancamento = result.Item;

					if(this.vm.Id == 0)
					{
						this.vm.IdLancamento = this.lancamento.Id;
						this.vm.Tipo = this.lancamento.Tipo;
						this.vm.IdContaBancaria = this.lancamento.IdContaBancaria;
						this.vm.IdFormaPagamento = this.lancamento.IdFormaPagamento;
						this.vm.Valor = this.lancamento.ValorSaldo;
						this.vm.Data = CommonHelper.getToday();
					}
					else
					{
						if(!this.vm.Tipo)
							this.vm.Tipo = this.lancamento.Tipo;

						if(this.vm.IdContaBancaria == null)
							this.vm.IdContaBancaria = this.lancamento.IdContaBancaria;
						
						if(this.vm.IdFormaPagamento == null)	
							this.vm.IdFormaPagamento = this.lancamento.IdFormaPagamento;
					}
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

	private formataDatas(): void
	{
		//resolve probelmas de data
		this.vm.Data = CommonHelper.setDate(this.vm.Data);
	}

	private valida(): boolean
	{
		let isValid = true;
		let errors = new Array<string>();

		if(!this.vm.Data)
		{
			this.vm.Data = CommonHelper.getToday();
		}

		if(!this.vm.Valor)
		{
			this.vm.Valor = this.lancamento.ValorSaldo;
		}

		return isValid;
	}
	
	private insere(): void
	{
		if(this.valida())
		{
			this.loading.Status = true;
			
			this.lancamentoBaixaService
				.insere(this.vm)
				.then((result) => 
				{
					if(result.IsValid)
					{
						this.vm = result.Item;
						this.formataDatas();
						
						this.dialogService.alert('Informações do sistema', ['Baixa incluida com sucesso'], DialogTypeEnum.Sucesso, () => 
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

	private atualiza(): void
	{
		if(this.valida())
		{
			this.loading.Status = true;
			
			this.lancamentoBaixaService
				.atualiza(this.vm)
				.then((result) => 
				{
					if(result.IsValid)
					{
						this.vm = result.Item;
						this.formataDatas();
						
						this.dialogService.alert('Informações do sistema', ['Baixa atualizada com sucesso'], DialogTypeEnum.Sucesso, () => 
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

	public onSalvar_Click(): void
	{
		if(this.vm.Id == 0)
			this.insere();
		else
			this.atualiza();
	}
}
