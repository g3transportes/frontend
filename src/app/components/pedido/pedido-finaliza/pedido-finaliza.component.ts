import { Component, OnInit, Input } from '@angular/core';
import { FinalizaPedido } from 'src/app/helpers/finaliza-pedido.helper';
import { SelectItem } from 'primeng/api/selectitem';
import { Loading } from 'src/app/helpers/loading.helper';
import { PedidoService } from 'src/app/services/pedido.service';
import { FormaPagamentoService } from 'src/app/services/forma-pagamento.service';
import { DialogService, DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DialogServiceHelper } from 'src/app/services/dialog.service';
import { CommonHelper } from 'src/app/helpers/common.helper';
import { DialogTypeEnum } from 'src/app/enums/dialog-type.enum';
import { Lancamento } from 'src/app/models/lancamento.model';
import { RemetenteService } from 'src/app/services/remetente.service';
import { RemetenteFilter } from 'src/app/filters/remetente.filter';
import { ContaBancariaService } from 'src/app/services/conta-bancaria.service';
import { CentroCustoService } from 'src/app/services/centro-custo.service';
import { CentroCusto } from 'src/app/models/centro-custo.model';
import { Variable } from '@angular/compiler/src/render3/r3_ast';
import { Remetente } from 'src/app/models/remetente.model';
import { EstoqueEditaComponent } from '../../estoque/estoque-edita/estoque-edita.component';
import { RemetenteEstoque } from 'src/app/models/remetente-estoque.model';

@Component({
	selector: 'app-pedido-finaliza',
	templateUrl: './pedido-finaliza.component.html',
	styleUrls: ['./pedido-finaliza.component.css'],
	providers: [ DialogService ]
})
export class PedidoFinalizaComponent implements OnInit
{
	@Input() public id: number;
	public vm: FinalizaPedido = new FinalizaPedido();
	public formasPagamento: SelectItem[];
	public contasBancarias: SelectItem[];
	public centrosCusto: CentroCusto[];
	public remetentes: SelectItem[];
	private listaRemetentes: Remetente[];
	public loading: Loading = new Loading();
	public localeBR: any;

	constructor(private pedidoService: PedidoService,
		private formaPagamentoService: FormaPagamentoService,
		private contaBancariaService: ContaBancariaService,
		private remententeService: RemetenteService,
		private centroCustoService: CentroCustoService,
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
		// verifica id
		this.id = this.config.data.id;

		// inicializa locale
		this.localeBR = CommonHelper.calendarLocale();

		// carrega item
		this.carregaFormasPagamento();
		this.carregaContasBancarias();
		this.carregaRemetentes();
		this.carregaCentrosCusto();

	}

	private formataDatas(): void
	{
		// resolve probelmas de data
		this.vm.Pedido.DataCriacao = CommonHelper.setDate(this.vm.Pedido.DataCriacao);

		if(this.vm.Pedido.DataColeta)
			this.vm.Pedido.DataColeta = CommonHelper.setDate(this.vm.Pedido.DataColeta);

		if(this.vm.Pedido.DataFinalizado)
			this.vm.Pedido.DataFinalizado = CommonHelper.setDate(this.vm.Pedido.DataFinalizado);
	}

	private carregaFormasPagamento(): void
	{
		// inicializa o loading
		this.loading.Status = true;

		// executa consulta
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
		// inicializa o loading
		this.loading.Status = true;

		// executa consulta
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

	private carregaRemetentes(): void
	{
		// inicializa o loading
		this.loading.Status = true;

		// filtro
		const filter = new RemetenteFilter();
		filter.AtivoFilter = true;
		filter.AtivoValue = true;

		// executa consulta
		this.remententeService
			.pegaLista(filter, 1, 10000)
			.then((result) =>
			{
				if(result.IsValid)
				{
					// carrega lista
					this.listaRemetentes = result.Items;

					// carrega drop down
					this.remetentes = new Array<SelectItem>();
					this.remetentes.push({ label: 'Nenhum remetente selecionado', value: null });

					result.Items.forEach((item, index, array) =>
					{
						const val = item.RazaoSocial + ' ( ' + item.EstoqueAtual + ' paletes )';
						this.remetentes.push({ label: val, value: item.Id });
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

	private carregaCentrosCusto(): void
	{
		// inicializa o loading
		this.loading.Status = true;

		// executa consulta
		this.centroCustoService
			.pegaLista()
			.then((result) =>
			{
				if(result.IsValid)
				{
					this.centrosCusto = result.Items.filter(a => a.UltimoNivel === true);
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
				this.carregaItem();
			});
	}

	private carregaItem(): void
	{
		if(this.id != 0)
		{
			this.loading.Status = true

			this.pedidoService
				.pegaItem(this.id)
				.then((result) =>
			{
				if(result.IsValid)
				{
					this.vm.Pedido = result.Item;
					this.vm.Pedido.DataColeta = CommonHelper.getToday();
					this.vm.Pedido.DataFinalizado = CommonHelper.getToday();
					this.vm.Pedido.Finalizado = true;

					this.formataDatas();
					this.inicializaLancamentos();
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
			this.dialogService.alert('Erro ao carregar os dados', [ 'Nenhum pedido informado' ], DialogTypeEnum.Erro, () =>
			{
				this.ref.close();
			});
		}
	}

	public pegaCentroCusto(lanc: Lancamento): SelectItem[]
	{
		let result: SelectItem[];

		result = new Array<SelectItem>();

		this.centrosCusto
			.filter(a => a.Tipo == lanc.Tipo)
			.forEach((item, index, array) =>
			{
				result.push({ label: item.Nome, value: item.Id });

				if(item.Padrao)
					lanc.IdCentroCusto = item.Id;
			});

		return result;
	}

	private inicializaLancamentos(): void
	{
		const cReceber = new Lancamento();
		const cPagar = new Lancamento();

		// inicializa conta a pagar
		cReceber.IdPedido = this.vm.Pedido.Id;
		cReceber.IdCliente = this.vm.Pedido.IdCliente;
		cReceber.IdCaminhao = this.vm.Pedido.IdCaminhao;
		cReceber.IdFormaPagamento = 0;
		cReceber.Tipo = 'D';
		cReceber.Favorecido = this.vm.Pedido.Caminhao.Motorista != null ? this.vm.Pedido.Caminhao.Motorista.Nome : 'Não Informado';
		cReceber.DataEmissao = CommonHelper.getToday();
		cReceber.DataVencimento = CommonHelper.getToday();
		cReceber.DataBaixa = null;
		cReceber.ValorBruto = this.vm.Pedido.ValorFrete;
		cReceber.ValorDesconto = 0;
		cReceber.ValorAcrescimo = 0;
		cReceber.ValorLiquido = this.vm.Pedido.ValorFrete;
		cReceber.ValorBaixado = 0;
		cReceber.ValorSaldo = cReceber.ValorLiquido
		cReceber.Observacao = '';
		cReceber.Baixado = false;

		this.vm.Lancamentos.push(cReceber);

		// inicializa conta a receber
		cPagar.IdPedido = this.vm.Pedido.Id;
		cPagar.IdCliente = this.vm.Pedido.IdCliente;
		cPagar.IdCaminhao = this.vm.Pedido.IdCaminhao;
		cPagar.IdFormaPagamento = 0;
		cPagar.Tipo = 'C';
		cPagar.Favorecido = 'G3 Transportes';
		cPagar.DataEmissao = CommonHelper.getToday();
		cPagar.DataVencimento = CommonHelper.getToday();
		cPagar.DataBaixa = null;
		cPagar.ValorBruto = this.vm.Pedido.ValorComissao;
		cPagar.ValorDesconto = this.vm.Pedido.ValorDesconto;
		cPagar.ValorAcrescimo = this.vm.Pedido.ValorAcrescimo + this.vm.Pedido.ValorPedagio;
		cPagar.ValorLiquido = this.vm.Pedido.ValorLiquido;
		cPagar.ValorSaldo = cPagar.ValorLiquido
		cPagar.ValorBaixado = 0;
		cPagar.Observacao = '';
		cPagar.Baixado = false;

		this.vm.Lancamentos.push(cPagar);
	}

	private valida(): boolean
	{
		let isValid = true;
		const errors = new Array<string>();

		if(!this.vm.Pedido.DataColeta)
		{
			isValid = false;
			errors.push('Informe a data da coleta');
		}

		// valida estoque
		if(this.vm.Pedido.IdRemetente != null)
		{
			const rem = this.listaRemetentes.find(a => a.Id == this.vm.Pedido.IdRemetente);

			// verifica se nao é nulo
			if(rem != null)
			{
				// verifica se remetente tem estoque
				if(rem.EstoqueAtual < this.vm.Pedido.Paletes)
				{
					isValid = false;
					errors.push('O remetente nao possui estoque de paletes suficiente');
					errors.push('Estoque atual: ' + rem.EstoqueAtual);
					errors.push('Estoque necessário: ' + this.vm.Pedido.Paletes);
				}
			}
		}

		// valida lancamentos
		this.vm.Lancamentos.forEach((value, index, array) =>
		{
			if(value.IdFormaPagamento == 0)
			{
				isValid = false;
				errors.push('Informe a forma de pagamento');
			}

			if(!value.DataEmissao)
			{
				isValid = false;
				errors.push('Informe a data de emissao');
			}

			if(!value.DataVencimento)
			{
				isValid = false;
				errors.push('Informe a data de vencimento');
			}

			if(!value.Favorecido)
			{
				isValid = false;
				errors.push('Informe o favorecido');
			}

			if(!value.ValorAcrescimo)
			{
				value.ValorAcrescimo = 0;
			}

			if(!value.ValorBaixado)
			{
				value.ValorBaixado = 0;
			}

			if(!value.ValorBruto)
			{
				value.ValorBruto = 0;
			}

			if(!value.ValorDesconto)
			{
				value.ValorDesconto = 0;
			}

			if(!value.ValorLiquido)
			{
				value.ValorLiquido = 0;
			}
		})


		if(isValid == false)
		{
			this.dialogService.alert('Erro ao validar o formulário', errors, DialogTypeEnum.Warning , null);
		}

		return isValid;
	}

	private finaliza(): void
	{
		if(this.valida())
		{
			this.loading.Status = true;

			this.pedidoService
				.finaliza(this.vm)
				.then((result) =>
				{
					if(result.IsValid)
					{
						this.dialogService.alert('Informações do sistema', ['Pedido coletado com sucesso'], DialogTypeEnum.Sucesso, () =>
						{
							this.ref.close(result.Item);
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

	private adicionaEstoque(): void
	{
		const title = 'Novo Registro';
		const data =
		{
			id: 0
		};

		const ref = this.modalService.open(EstoqueEditaComponent,
		{
			header: title,
			data,
			width: '60%'
		});

		ref.onClose.subscribe((result: RemetenteEstoque) =>
		{
			if(result != null)
			{
				this.carregaRemetentes();
			}
		});
	}

	public onAdicionaEstoque_Click(): void
	{
		this.adicionaEstoque();
	}

	public onSalvar_Click(): void
	{
		this.finaliza();
	}
}
