import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { DialogService } from 'primeng/dynamicdialog';
import { Loading } from 'src/app/helpers/loading.helper';
import { DialogServiceHelper } from 'src/app/services/dialog.service';
import { Pedido } from 'src/app/models/pedido.model';
import { ListResult } from 'src/app/helpers/list-result.helper';
import { PedidoFilter } from 'src/app/filters/pedido.filter';
import { PedidoService } from 'src/app/services/pedido.service';
import { DialogTypeEnum } from 'src/app/enums/dialog-type.enum';
import { PedidoEditaComponent } from '../pedido/pedido-edita/pedido-edita.component';
import { PedidoFinalizaComponent } from '../pedido/pedido-finaliza/pedido-finaliza.component';
import { PedidoEntregaComponent } from '../pedido/pedido-entrega/pedido-entrega.component';
import { Lancamento } from 'src/app/models/lancamento.model';
import { LancamentoFilter } from 'src/app/filters/lancamento.filter';
import { LancamentoService } from 'src/app/services/lancamento.service';
import { LancamentoEditaComponent } from '../lancamento/lancamento-edita/lancamento-edita.component';
import { LancamentoBaixaComponent } from '../lancamento/lancamento-baixa/lancamento-baixa.component';
import { Cliente } from 'src/app/models/cliente.model';
import { ClienteEditaComponent } from '../cliente/cliente-edita/cliente-edita.component';
import { Caminhao } from 'src/app/models/caminhao.model';
import { Motorista } from 'src/app/models/motorista.model';
import { CaminhaoEditaComponent } from '../caminhao/caminhao-edita/caminhao-edita.component';
import { MotoristaEditaComponent } from '../motorista/motorista-edita/motorista-edita.component';
import { ReportPedidoDetalheComponent } from 'src/app/reports/report-pedido-detalhe/report-pedido-detalhe.component';
import { SelectItem, MessageService } from 'primeng/api';
import { CommonHelper } from 'src/app/helpers/common.helper';
import {FormaPagamentoService} from '../../services/forma-pagamento.service';
import {ContaBancariaService} from '../../services/conta-bancaria.service';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css'],
	providers: [DialogService, MessageService]
})
export class DashboardComponent implements OnInit
{
	public vmPedidoSolicitacao: ListResult<Pedido> = new ListResult<Pedido>();
	public vmPedidoColeta: ListResult<Pedido> = new ListResult<Pedido>();
	public vmPedidoEntregue: ListResult<Pedido> = new ListResult<Pedido>();

	public vmFinancPagar: ListResult<Lancamento> = new ListResult<Lancamento>();
	public vmFinancReceber: ListResult<Lancamento> = new ListResult<Lancamento>();
	public vmFinancPago: ListResult<Lancamento> = new ListResult<Lancamento>();
	public vmFinancRecebido: ListResult<Lancamento> = new ListResult<Lancamento>();

	public autorizacao: SelectItem[];
	public contasBancarias: SelectItem[];
	public formasPagamento: SelectItem[];
	public mostraAutorizado: boolean = null;
	public filtroFormaPagamento: number = null;
	public filtroContaBancaria: number = null;
	public filtroDataEmissao: Date[];
	public loading: Loading = new Loading();
	public timeLeft = 300;
	private interval: any;
	public localeBR: any;

	constructor(public globalService: GlobalService,
		private pedidoService: PedidoService,
		private lancamentoService: LancamentoService,
		private formaPagamentoService: FormaPagamentoService,
		private contaBancariaService: ContaBancariaService,
		private messageService: MessageService,
		private modalService: DialogService,
		private dialogService: DialogServiceHelper)
	{

	}

	ngOnInit() {
		this.inicializa();
	}

	private inicializa(): void
	{
		this.globalService.verificaLogado();
		this.localeBR = CommonHelper.calendarLocale();
		this.carregaBreadcrumb();

		// carrega vm
		this.carregaPedidos();
		this.carregaLancamentos();
		this.carregaAutorizacao();
		this.carregaContasBancarias();
		this.carregaFormasPagamento();
		this.startTimer();
	}

	private carregaBreadcrumb(): void {
		this.globalService.home =
		{
			icon: 'pi pi-home',
			routerLink: '/'
		};

		this.globalService.breadcrumb =
			[
				{
					label: 'Dashboard'
				}
			];
	}

	private startTimer()
	{
		this.interval = setInterval(() =>
		{
			if(this.timeLeft > 0)
			{
				this.timeLeft--;
			}
			else
			{
				this.carregaPedidos();
				this.carregaLancamentos();
				this.timeLeft = 300;
			}
		},1000);
	}

	private carregaAutorizacao(): void
	{
		this.autorizacao = new Array<SelectItem>();
		this.autorizacao.push({ label: 'Todos os registros', value: null });
		this.autorizacao.push({ label: 'Somente autorizados', value: true });
		this.autorizacao.push({ label: 'Somente não autorizados', value: false });
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
					this.formasPagamento.push({ label: 'Todos os registros', value: null });

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
					this.contasBancarias.push({ label: 'Todos os registros', value: null });

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

	//#region Metodos - Pedidos

	private carregaPedidoSolicitacao(): void
	{
		const filtro = new PedidoFilter();
		filtro.SolicitacaoFilter = true;
		filtro.SolicitacaoValue = true;
		filtro.AtivoFilter = true;
		filtro.AtivoValue = true;

		this.pedidoService
			.pegaLista(filtro, this.vmPedidoSolicitacao.CurrentPage, this.vmPedidoSolicitacao.PageSize)
			.then((result) =>
			{
				if(result.IsValid)
				{
					this.vmPedidoSolicitacao = result;
				}
				else
				{
					this.dialogService.alert('Erro ao carregar os dados1', result.Errors, DialogTypeEnum.Erro, null);
				}
			})
			.catch((error) =>
			{
				this.dialogService.alert('Erro ao carregar os dados2', [ error ], DialogTypeEnum.Erro, null);
			})
			.finally(() =>
			{
				this.loading.Status = false;
			});
	}

	private carregaPedidoColeta(): void
	{
		const filtro = new PedidoFilter();
		filtro.ColetadoFilter = true;
		filtro.ColetadoValue = false;
		filtro.SolicitacaoFilter = true;
		filtro.SolicitacaoValue = false;
		filtro.AtivoFilter = true;
		filtro.AtivoValue = true;

		this.pedidoService
			.pegaLista(filtro, this.vmPedidoColeta.CurrentPage, this.vmPedidoColeta.PageSize)
			.then((result) =>
			{
				if(result.IsValid)
				{
					this.vmPedidoColeta = result;
				}
				else
				{
					this.dialogService.alert('Erro ao carregar os dados', result.Errors, DialogTypeEnum.Erro, null);
				}
			})
			.catch((error) =>
			{
				this.dialogService.alert('Erro ao carregar os dados2', [ error ], DialogTypeEnum.Erro, null);
			})
			.finally(() =>
			{
				this.loading.Status = false;
			});
	}

	private carregaPedidoEntrega(): void
	{
		const filtro = new PedidoFilter();
		filtro.ColetadoFilter = true;
		filtro.ColetadoValue = true;
		filtro.SolicitacaoFilter = true;
		filtro.SolicitacaoValue = false;
		filtro.EntregueFilter = true;
		filtro.EntregueValue = false;
		filtro.ColetadoValue = true;
		filtro.AtivoFilter = true;
		filtro.AtivoValue = true;

		this.pedidoService
			.pegaLista(filtro, this.vmPedidoEntregue.CurrentPage, this.vmPedidoEntregue.PageSize)
			.then((result) =>
			{
				if(result.IsValid)
				{
					this.vmPedidoEntregue = result;
				}
				else
				{
					this.dialogService.alert('Erro ao carregar os dados', result.Errors, DialogTypeEnum.Erro, null);
				}
			})
			.catch((error) =>
			{
				this.dialogService.alert('Erro ao carregar os dados2', [ error ], DialogTypeEnum.Erro, null);
			})
			.finally(() =>
			{
				this.loading.Status = false;
			});
	}

	private carregaPedidos(): void
	{
		this.carregaPedidoSolicitacao();
		this.carregaPedidoColeta();
		this.carregaPedidoEntrega();
	}

	private pedidoDeleta(item: Pedido): void
	{
		this.loading.Status = true;

		this.pedidoService
			.deleta(item.Id)
			.then((result) =>
			{
				if(result.IsValid)
				{
					this.carregaPedidos();
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

	private pedidoAdiciona(): void
	{
		const title = 'Novo Registro';
		const data =
		{
			id: 0
		};

		const ref = this.modalService.open(PedidoEditaComponent,
		{
			header: title,
			data,
			width: '80%'
		});

		ref.onClose.subscribe((result: Pedido) =>
		{
			if(result != null)
			{
				this.carregaPedidos();
			}
		});
	}

	private pedidoEdita(item: Pedido): void
	{
		const title = 'Editando: ' + item.OrdemServico;
		const data =
		{
			id: item.Id
		};

		const ref = this.modalService.open(PedidoEditaComponent,
		{
			header: title,
			data,
			width: '80%'
		});

		ref.onClose.subscribe((result: Pedido) =>
		{
			if(result != null)
			{
				this.carregaPedidos();
			}
		});
	}

	private pedidoFinaliza(item: Pedido): void
	{
		const title = 'Finalizando: ' + item.OrdemServico;
		const data =
		{
			id: item.Id
		};

		const ref = this.modalService.open(PedidoFinalizaComponent,
		{
			header: title,
			data,
			width: '60%'
		});

		ref.onClose.subscribe((result: Pedido) =>
		{
			if(result != null)
			{
				this.carregaPedidos();
			}
		});
	}

	private pedidoEntrega(item: Pedido): void
	{
		const title = 'Entregando: ' + item.OrdemServico;
		const data =
		{
			id: item.Id
		};

		const ref = this.modalService.open(PedidoEntregaComponent,
		{
			header: title,
			data,
			width: '60%'
		});

		ref.onClose.subscribe((result: Pedido) =>
		{
			if(result != null)
			{
				this.carregaPedidos();
			}
		});
	}

	private pedidoEstorna(item: Pedido): void
	{
		this.loading.Status = true;

		this.pedidoService
			.estorna(item)
			.then((result) =>
			{
				if(result.IsValid)
				{
					this.carregaPedidos();
				}
				else
				{
					this.dialogService.alert('Erro ao estornar os dados', result.Errors, DialogTypeEnum.Erro, null);
				}
			})
			.catch((error) =>
			{
				this.dialogService.alert('Erro ao estornar os dados', [ error ], DialogTypeEnum.Erro, null);
			})
			.finally(() =>
			{
				this.loading.Status = false;
			});
	}

	private pedidoImprime(item: Pedido): void
	{
		const title = 'Detalhes: ' + item.OrdemServico;
		const data =
		{
			pedido: item
		};

		const ref = this.modalService.open(ReportPedidoDetalheComponent,
		{
			header: title,
			data,
			width: '75%'
		});

		ref.onClose.subscribe(() => { });
	}

	//#endregion

	//#region Metodos - Financeiro

	private carregaFinanceiroPagar(): void
	{

		const filtro = new LancamentoFilter();
		filtro.TipoFilter = true;
		filtro.TipoValue = 'D';
		filtro.BaixadoFilter = true;
		filtro.BaixadoValue = false;

		const mesAtual = CommonHelper.getToday().getMonth() + 1;
		const anoAtual = CommonHelper.getToday().getFullYear();
		filtro.VencimentoFilter = true;
		filtro.VencimentoMaxValue = new Date(anoAtual, mesAtual, 0);

		if(this.mostraAutorizado != null)
		{
			filtro.AutorizadoFilter = true;
			filtro.AutorizadoValue = this.mostraAutorizado;
		}

		if(this.filtroFormaPagamento !== null)
		{
			filtro.FormaPagamentoFilter = true;
			filtro.FormaPagamentoValue = this.filtroFormaPagamento;
		}

		if(this.filtroContaBancaria !== null)
		{
			filtro.ContaBancariaFilter = true;
			filtro.ContaBancariaValue = this.filtroContaBancaria;
		}

		if(this.filtroDataEmissao != null  && this.filtroDataEmissao !== undefined)
		{
			filtro.EmissaoFilter = true;
			filtro.EmissaoMinValue = this.filtroDataEmissao[0];
			if(this.filtroDataEmissao[1] != null && this.filtroDataEmissao[1] !== undefined)
				filtro.EmissaoMaxValue = this.filtroDataEmissao[1];
			else
				filtro.EmissaoMaxValue = filtro.EmissaoMinValue;
		}
		else
		{
			filtro.EmissaoFilter = false;
			filtro.EmissaoMinValue = null;
			filtro.EmissaoMaxValue = null;
		}

		this.lancamentoService
			.pegaLista(filtro, this.vmFinancPagar.CurrentPage, this.vmFinancPagar.PageSize)
			.then((result) =>
			{
				if(result.IsValid)
				{
					this.vmFinancPagar = result;
					this.vmFinancPagar.Items = this.ordenaPorVencimento(this.vmFinancPagar.Items);
				}
				else
				{
					this.dialogService.alert('Erro ao carregar os dados1', result.Errors, DialogTypeEnum.Erro, null);
				}
			})
			.catch((error) =>
			{
				this.dialogService.alert('Erro ao carregar os dados2', [ error ], DialogTypeEnum.Erro, null);
			})
			.finally(() =>
			{
				this.loading.Status = false;
			});
	}

	private carregaFinanceiroReceber(): void
	{
		const filtro = new LancamentoFilter();
		filtro.TipoFilter = true;
		filtro.TipoValue = 'C';
		filtro.BaixadoFilter = true;
		filtro.BaixadoValue = false;

		const mesAtual = CommonHelper.getToday().getMonth() + 1;
		const anoAtual = CommonHelper.getToday().getFullYear();
		filtro.VencimentoFilter = true;
		filtro.VencimentoMaxValue = new Date(anoAtual, mesAtual, 0);

		if(this.mostraAutorizado != null)
		{
			filtro.AutorizadoFilter = true;
			filtro.AutorizadoValue = this.mostraAutorizado;
		}

		if(this.filtroFormaPagamento !== null)
		{
			filtro.FormaPagamentoFilter = true;
			filtro.FormaPagamentoValue = this.filtroFormaPagamento;
		}

		if(this.filtroContaBancaria !== null)
		{
			filtro.ContaBancariaFilter = true;
			filtro.ContaBancariaValue = this.filtroContaBancaria;
		}

		if(this.filtroDataEmissao != null  && this.filtroDataEmissao !== undefined)
		{
			filtro.EmissaoFilter = true;
			filtro.EmissaoMinValue = this.filtroDataEmissao[0];
			if(this.filtroDataEmissao[1] != null && this.filtroDataEmissao[1] !== undefined)
				filtro.EmissaoMaxValue = this.filtroDataEmissao[1];
			else
				filtro.EmissaoMaxValue = filtro.EmissaoMinValue;
		}
		else
		{
			filtro.EmissaoFilter = false;
			filtro.EmissaoMinValue = null;
			filtro.EmissaoMaxValue = null;
		}

		this.lancamentoService
			.pegaLista(filtro, this.vmFinancReceber.CurrentPage, this.vmFinancReceber.PageSize)
			.then((result) =>
			{
				if(result.IsValid)
				{
					this.vmFinancReceber = result;
					this.vmFinancReceber.Items = this.ordenaPorVencimento(this.vmFinancReceber.Items);
				}
				else
				{
					this.dialogService.alert('Erro ao carregar os dados1', result.Errors, DialogTypeEnum.Erro, null);
				}
			})
			.catch((error) =>
			{
				this.dialogService.alert('Erro ao carregar os dados2', [ error ], DialogTypeEnum.Erro, null);
			})
			.finally(() =>
			{
				this.loading.Status = false;
			});
	}

	private carregaFinanceiroPago(): void
	{
		const filtro = new LancamentoFilter();
		filtro.TipoFilter = true;
		filtro.TipoValue = 'D';
		filtro.BaixadoFilter = true;
		filtro.BaixadoValue = true;

		if(this.mostraAutorizado != null)
		{
			filtro.AutorizadoFilter = true;
			filtro.AutorizadoValue = this.mostraAutorizado;
		}

		if(this.filtroFormaPagamento !== null)
		{
			filtro.FormaPagamentoFilter = true;
			filtro.FormaPagamentoValue = this.filtroFormaPagamento;
		}

		if(this.filtroContaBancaria !== null)
		{
			filtro.ContaBancariaFilter = true;
			filtro.ContaBancariaValue = this.filtroContaBancaria;
		}

		if(this.filtroDataEmissao != null  && this.filtroDataEmissao !== undefined)
		{
			filtro.EmissaoFilter = true;
			filtro.EmissaoMinValue = this.filtroDataEmissao[0];
			if(this.filtroDataEmissao[1] != null && this.filtroDataEmissao[1] !== undefined)
				filtro.EmissaoMaxValue = this.filtroDataEmissao[1];
			else
				filtro.EmissaoMaxValue = filtro.EmissaoMinValue;
		}
		else
		{
			filtro.EmissaoFilter = false;
			filtro.EmissaoMinValue = null;
			filtro.EmissaoMaxValue = null;
		}

		this.lancamentoService
			.pegaLista(filtro, this.vmFinancPago.CurrentPage, this.vmFinancPago.PageSize)
			.then((result) =>
			{
				if(result.IsValid)
				{
					this.vmFinancPago = result;
				}
				else
				{
					this.dialogService.alert('Erro ao carregar os dados1', result.Errors, DialogTypeEnum.Erro, null);
				}
			})
			.catch((error) =>
			{
				this.dialogService.alert('Erro ao carregar os dados2', [ error ], DialogTypeEnum.Erro, null);
			})
			.finally(() =>
			{
				this.loading.Status = false;
			});
	}

	private carregaFinanceiroRecebido(): void
	{
		const filtro = new LancamentoFilter();
		filtro.TipoFilter = true;
		filtro.TipoValue = 'C';
		filtro.BaixadoFilter = true;
		filtro.BaixadoValue = true;

		if(this.mostraAutorizado != null)
		{
			filtro.AutorizadoFilter = true;
			filtro.AutorizadoValue = this.mostraAutorizado;
		}

		if(this.filtroFormaPagamento !== null)
		{
			filtro.FormaPagamentoFilter = true;
			filtro.FormaPagamentoValue = this.filtroFormaPagamento;
		}

		if(this.filtroContaBancaria !== null)
		{
			filtro.ContaBancariaFilter = true;
			filtro.ContaBancariaValue = this.filtroContaBancaria;
		}

		if(this.filtroDataEmissao != null  && this.filtroDataEmissao !== undefined)
		{
			filtro.EmissaoFilter = true;
			filtro.EmissaoMinValue = this.filtroDataEmissao[0];
			if(this.filtroDataEmissao[1] != null && this.filtroDataEmissao[1] !== undefined)
				filtro.EmissaoMaxValue = this.filtroDataEmissao[1];
			else
				filtro.EmissaoMaxValue = filtro.EmissaoMinValue;
		}
		else
		{
			filtro.EmissaoFilter = false;
			filtro.EmissaoMinValue = null;
			filtro.EmissaoMaxValue = null;
		}

		this.lancamentoService
			.pegaLista(filtro, this.vmFinancRecebido.CurrentPage, this.vmFinancRecebido.PageSize)
			.then((result) =>
			{
				if(result.IsValid)
				{
					this.vmFinancRecebido = result;
				}
				else
				{
					this.dialogService.alert('Erro ao carregar os dados1', result.Errors, DialogTypeEnum.Erro, null);
				}
			})
			.catch((error) =>
			{
				this.dialogService.alert('Erro ao carregar os dados2', [ error ], DialogTypeEnum.Erro, null);
			})
			.finally(() =>
			{
				this.loading.Status = false;
			});
	}

	private carregaLancamentos(): void
	{
		// inicializa paginacao
		this.vmFinancPagar.CurrentPage = 1;
		this.vmFinancReceber.CurrentPage = 1;
		this.vmFinancPago.CurrentPage = 1;
		this.vmFinancRecebido.CurrentPage = 1;

		// faz consulta
		this.carregaFinanceiroPagar();
		this.carregaFinanceiroReceber();
		this.carregaFinanceiroPago();
		this.carregaFinanceiroRecebido();
	}

	private lancamentoDeleta(item: Lancamento): void
	{
		this.loading.Status = true;

		this.lancamentoService
			.deleta(item.Id)
			.then((result) =>
			{
				if(result.IsValid)
				{
					this.carregaLancamentos();
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

	private lancamentoAdiciona(): void
	{
		const title = 'Novo Registro';
		const data =
		{
			id: 0
		};

		const ref = this.modalService.open(LancamentoEditaComponent,
		{
			header: title,
			data,
			width: '80%'
		});

		ref.onClose.subscribe((result: Lancamento) =>
		{
			if(result != null)
			{
				this.carregaLancamentos();
			}
		});
	}

	private lancamentoEdita(item: Lancamento): void
	{
		const title = 'Editando: ' + item.Id;
		const data =
		{
			id: item.Id
		};

		const ref = this.modalService.open(LancamentoEditaComponent,
		{
			header: title,
			data,
			width: '80%'
		});

		ref.onClose.subscribe((result: Lancamento) =>
		{
			this.carregaLancamentos();
		});
	}

	private lancamentoBaixa(item: Lancamento): void
	{
		const title = 'Baixando: ' + item.Id;
		const data =
		{
			id: 0,
			idLancamento: item.Id
		};

		const ref = this.modalService.open(LancamentoBaixaComponent,
		{
			header: title,
			data,
			width: '40%'
		});

		ref.onClose.subscribe((result: Lancamento) =>
		{
			if(result != null)
			{
				this.carregaLancamentos();
			}
		});
	}

	private lancamentoEstorna(item: Lancamento): void
	{
		this.loading.Status = true;

		this.lancamentoService
			.estorna(item)
			.then((result) =>
			{
				if(result.IsValid)
				{
					this.carregaLancamentos();
				}
				else
				{
					this.dialogService.alert('Erro ao estornar o lancamento', result.Errors, DialogTypeEnum.Erro, null);
				}
			})
			.catch((error) =>
			{
				this.dialogService.alert('Erro ao estornar o lancamento', [ error ], DialogTypeEnum.Erro, null);
			})
			.finally(() =>
			{
				this.loading.Status = false;
			});
	}

	private autoriza(item: Lancamento): void
	{
		// verifica dados da autorizacao
		if(item.Autorizado === true)
		{
			item.DataAutorizacao = CommonHelper.getToday();
			item.UsuarioAutorizacao = this.globalService.currentUser.Nome;
		}
		else
		{
			item.DataAutorizacao = null;
			item.UsuarioAutorizacao = '';
		}

		// salva
		this.lancamentoService
			.atualiza(item)
			.then((result) =>
			{
				if(result.IsValid)
				{
					// mostra toaster
					this.carregaLancamentos();

					// mostra toaster
					if(result.Item.Autorizado)
						this.messageService.add({severity:'success', summary:'Autorizacao', detail:'Lancamento autorizado'});
					else
						this.messageService.add({severity:'info', summary:'Autorizacao', detail:'Lancamento desautorizado'});
				}
				else
				{
					this.dialogService.alert('Erro ao carregar os dados1', result.Errors, DialogTypeEnum.Erro, null);
				}
			})
			.catch((error) =>
			{
				this.dialogService.alert('Erro ao carregar os dados2', [ error ], DialogTypeEnum.Erro, null);
			})
	}

	public ordenaPorVencimento(lista: Array<Lancamento>): Array<Lancamento>
	{
		return lista.sort((a, b) => (a.DataVencimento > b.DataVencimento) ? 1 : -1);
	}

	//#endregion

	//#region Metodos - Gerais

	private clienteEdita(item: Cliente): void
	{
		const title = 'Editando Cliente: ' + item.RazaoSocial;
		const data =
		{
			id: item.Id
		};

		const ref = this.modalService.open(ClienteEditaComponent,
		{
			header: title,
			data,
			width: '80%'
		});

		ref.onClose.subscribe((result: Cliente) =>
		{
			if(result != null)
			{
				this.carregaPedidos();
				this.carregaLancamentos();
			}
		});
	}

	private caminhaoEdita(item: Caminhao): void
	{
		const title = 'Editando Caminhão: ' + item.Placa;
		const data =
		{
			id: item.Id
		};

		const ref = this.modalService.open(CaminhaoEditaComponent,
		{
			header: title,
			data,
			width: '80%'
		});

		ref.onClose.subscribe((result: Caminhao) =>
		{
			if(result != null)
			{
				this.carregaPedidos();
				this.carregaLancamentos();
			}
		});
	}

	private motoristaEdita(item: Motorista): void
	{
		const title = 'Editando Motorista: ' + item.Nome;
		const data =
		{
			id: item.Id
		};

		const ref = this.modalService.open(MotoristaEditaComponent,
		{
			header: title,
			data,
			width: '80%'
		});

		ref.onClose.subscribe((result: Motorista) =>
		{
			if(result != null)
			{
				this.carregaPedidos();
				this.carregaLancamentos();
			}
		});
	}

	//#endregion

	//#region Eventos - Pedidos

	public onPedidoAdiciona_Click(): void
	{
		this.pedidoAdiciona()
	}

	public onPedidoEdita_Click(item: Pedido): void
	{
		this.pedidoEdita(item);
	}

	public onPedidoDeleta_Click(item: Pedido): void
	{
		const title = 'Confirmação de exclusão';
		const message = 'Tem certeza que deseja excluir o registro ' + item.OrdemServico + '?'

		this.dialogService.confirm(title, message, () => {
			this.pedidoDeleta(item)
		}, null);
	}

	public onPedidoFinaliza_Click(item: Pedido): void
	{
		this.pedidoFinaliza(item);
	}

	public onPedidoEntrega_Click(item: Pedido): void
	{
		this.pedidoEntrega(item);
	}

	public onPedidoImprime_Click(item: Pedido): void
	{
		this.pedidoImprime(item);
	}

	public onPedidoEstorna_Click(item: Pedido): void
	{
		const title = 'Confirmação de estorno';
		const message = 'Tem certeza que deseja estornar a coleta do registro ' + item.OrdemServico + '? Todos os lancamentos financeiros serão excluídos';

		this.dialogService.confirm(title, message, () => {
			this.pedidoEstorna(item);
		}, null);
	}

	public onPedidoSolicitacaoPage_Change(event: any): void
	{
		this.vmPedidoSolicitacao.CurrentPage = event.page + 1;
		this.carregaPedidoSolicitacao();
	}

	public onPedidoColetaPage_Change(event: any): void
	{
		this.vmPedidoColeta.CurrentPage = event.page + 1;
		this.carregaPedidoColeta();
	}

	public onPedidoEntregaPage_Change(event: any): void
	{
		this.vmPedidoEntregue.CurrentPage = event.page + 1;
		this.carregaPedidoEntrega();
	}

	//#endregion

	//#region Eventos - Financeiro

	public onLancamentoAdiciona_Click(): void
	{
		this.lancamentoAdiciona()
	}

	public onLancamentoEdita_Click(item: Lancamento): void
	{
		this.lancamentoEdita(item);
	}

	public onLancamentoDeleta_Click(item: Lancamento): void
	{
		const title = 'Confirmação de exclusão';
		const message = 'Tem certeza que deseja excluir o registro ' + item.Id + '?'

		this.dialogService.confirm(title, message, () => {
			this.lancamentoDeleta(item)
		}, null);
	}

	public onLancamentoBaixa_Click(item: Lancamento): void
	{
		this.lancamentoBaixa(item);
	}

	public onLancamentoEstorna_Click(item: Lancamento): void
	{
		const title = 'Confirmação de estorno';
		const message = 'Tem certeza que deseja estornar a baixa do registro ' + item.Id + '?'

		this.dialogService.confirm(title, message, () => {
			this.lancamentoEstorna(item)
		}, null);
	}

	public onFinancPagarPage_Change(event: any): void
	{
		this.vmFinancPagar.CurrentPage = event.page + 1;
		this.carregaFinanceiroPagar();
	}

	public onFinancReceberPage_Change(event: any): void
	{
		this.vmFinancReceber.CurrentPage = event.page + 1;
		this.carregaFinanceiroReceber();
	}

	public onFinancPagoPage_Change(event: any): void
	{
		this.vmFinancPago.CurrentPage = event.page + 1;
		this.carregaFinanceiroPago();
	}

	public onFinancRecebidoPage_Change(event: any): void
	{
		this.vmFinancRecebido.CurrentPage = event.page + 1;
		this.carregaFinanceiroRecebido();
	}

	public onAutorizacao_Change(item: Lancamento): void
	{
		this.autoriza(item);
	}

	//#endregion

	//#region Eventos - Gerais

	public onClienteEdita_Click(item: Cliente): void
	{
		if(item != null)
			if(item.Id !== 0)
				this.clienteEdita(item);
	}

	public onCaminhaoEdita_Click(item: Caminhao): void
	{
		if(item != null)
			if(item.Id !== 0)
				this.caminhaoEdita(item);
	}

	public onMotoristaEdita_Click(item: Motorista): void
	{
		if(item != null)
			if(item.Id !== 0)
				this.motoristaEdita(item);
	}

	public onRecarrega_Click(): void
	{
		this.carregaPedidos();
		this.carregaLancamentos();
		this.timeLeft = 300;
	}

	//#endregion
}
