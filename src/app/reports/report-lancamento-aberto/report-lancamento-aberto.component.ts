import { Component, OnInit, Input } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { LancamentoFilter } from 'src/app/filters/lancamento.filter';
import { Lancamento } from 'src/app/models/lancamento.model';
import { ListResult } from 'src/app/helpers/list-result.helper';
import { SelectItem } from 'primeng/api/selectitem';
import { Loading } from 'src/app/helpers/loading.helper';
import { GlobalService } from 'src/app/services/global.service';
import { LancamentoService } from 'src/app/services/lancamento.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { CaminhaoService } from 'src/app/services/caminhao.service';
import { FormaPagamentoService } from 'src/app/services/forma-pagamento.service';
import { DialogServiceHelper } from 'src/app/services/dialog.service';
import { CommonHelper } from 'src/app/helpers/common.helper';
import { PedidoFilter } from 'src/app/filters/pedido.filter';
import { ClienteFilter } from 'src/app/filters/cliente.filter';
import { CaminhaoFilter } from 'src/app/filters/caminhao.filter';
import { DialogTypeEnum } from 'src/app/enums/dialog-type.enum';
import { LancamentoEditaComponent } from 'src/app/components/lancamento/lancamento-edita/lancamento-edita.component';
import { LancamentoBaixaComponent } from 'src/app/components/lancamento/lancamento-baixa/lancamento-baixa.component';
import { ContaBancariaService } from 'src/app/services/conta-bancaria.service';
import { CentroCustoService } from 'src/app/services/centro-custo.service';
import { TipoDocumentoService } from 'src/app/services/tipo-documento.service';
import { ProprietarioService } from 'src/app/services/proprietario.service';
import { ProprietarioFilter } from 'src/app/filters/proprietario.filter';
import { MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';



@Component({
	selector: 'app-report-lancamento-aberto',
	templateUrl: './report-lancamento-aberto.component.html',
	styleUrls: ['./report-lancamento-aberto.component.css'],
	providers: [ DialogService, MessageService ]
})

export class ReportLancamentoAbertoComponent implements OnInit
{
	@Input() public filtro: LancamentoFilter;
	public vm : ListResult<Lancamento> = new ListResult<Lancamento>();
	public tipos: SelectItem[];
	public clientes: SelectItem[];
	public caminhoes: SelectItem[];
	public proprietarios: SelectItem[];
	public formasPagamento: SelectItem[];
	public contasBancarias: SelectItem[];
	public centrosCusto: SelectItem[];
	public tiposDocumento: SelectItem[];
	public autorizacao: SelectItem[];
	public ordenacao: SelectItem[];
	public orderby: string = 'vencimento';
	public loading: Loading = new Loading();
	public localeBR: any;
	public showReport: boolean = false;

	constructor(public globalService: GlobalService,
		private lancamentoService: LancamentoService,
		private pedidoService: PedidoService,
		private clienteService: ClienteService,
		private caminhaoService: CaminhaoService,
		private proprietarioService: ProprietarioService,
		private formaPagamentoService: FormaPagamentoService,
		private contaBancariaService: ContaBancariaService,
		private centroCustoService: CentroCustoService,
		private tipoDocumentoService: TipoDocumentoService,
		private modalService: DialogService,
		private messageService: MessageService,
		private dialogService: DialogServiceHelper)
	{

	}

	ngOnInit(): void
	{
		this.inicializa();
	}

	private inicializa(): void
	{
		this.globalService.verificaLogado();
		this.localeBR = CommonHelper.calendarLocale();

		//verifica filtro
		if(this.filtro == null)
			this.filtro = new LancamentoFilter();

		this.filtro.BaixadoFilter = true;
		this.filtro.BaixadoValue = false;

		this.carregaBreadcrumb();
		this.carregaTipos()
		this.carregaClientes();
		this.carregaCaminhoes();
		this.carregaProprietarios();
		this.carregaFormasPagamento();
		this.carregaContasBancarias();
		this.carregaCentrosCusto();
		this.carregaTiposDocumento();
		this.carregaAutorizacao();
		this.carregaOrdenacao();
	}

	private carregaBreadcrumb(): void
	{
		this.globalService.home =
		{
			icon: 'pi pi-home',
			routerLink: '/'
		};

		this.globalService.breadcrumb =
		[
			{
				label: 'Relatórios'
			},
			{
				label: 'Lançamentos Em Aberto'
			}
		];
	}

	private carregaTipos(): void
	{
		this.tipos = new Array<SelectItem>();

		this.tipos.push({ label: 'Todos', value: null });
		this.tipos.push({ label: 'Entrada', value: 'C' });
		this.tipos.push({ label: 'Saída', value: 'D' });
	}

	private carregaClientes(): void
	{
		//inicializa o loading
		this.loading.Status = true;

		//filtro
		let filter = new ClienteFilter();
		filter.AtivoFilter = true;
		filter.AtivoValue = true;

		//executa consulta
		this.clienteService
			.pegaLista(filter, 1, 10000)
			.then((result) =>
			{
				if(result.IsValid)
				{
					this.clientes = new Array<SelectItem>();
					this.clientes.push({ label: 'Todos os registros', value: null });

					result.Items.forEach((item, index, array) =>
					{
						this.clientes.push({ label: item.RazaoSocial, value: item.Id });
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

	private carregaCaminhoes(): void
	{
		//inicializa o loading
		this.loading.Status = true;

		//filtro
		let filter = new CaminhaoFilter();
		filter.AtivoFilter = true;
		filter.AtivoValue = true;

		//executa consulta
		this.caminhaoService
			.pegaLista(filter, 1, 10000)
			.then((result) =>
			{
				if(result.IsValid)
				{
					this.caminhoes = new Array<SelectItem>();
					this.caminhoes.push({ label: 'Todos os registros', value: null });

					result.Items.forEach((item, index, array) =>
					{
						let motorista = item.Motorista != null ? item.Motorista.Nome : 'Sem motorista'
						this.caminhoes.push({ label: item.Placa + ' - ' + motorista, value: item.Id });
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
					this.proprietarios.push({ label: 'Todos os registros', value: null });

					result.Items.forEach((item, index, array) =>
					{
						this.proprietarios.push({ label: item.Nome, value: item.Id });
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

	private carregaTiposDocumento(): void
	{
		//inicializa o loading
		this.loading.Status = true;

		//executa consulta
		this.tipoDocumentoService
			.pegaLista()
			.then((result) =>
			{
				if(result.IsValid)
				{
					this.tiposDocumento = new Array<SelectItem>();
					this.tiposDocumento.push({ label: 'Todos os registros', value: null });

					result.Items.forEach((item, index, array) =>
					{
						this.tiposDocumento.push({ label: item.Nome, value: item.Id });
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

	private carregaAutorizacao(): void
	{
		this.autorizacao = new Array<SelectItem>();
		this.autorizacao.push({ label: 'Todos os registros', value: null });
		this.autorizacao.push({ label: 'Somente autorizados', value: true });
		this.autorizacao.push({ label: 'Somente não autorizados', value: false });
	}

	private carregaOrdenacao(): void
	{
		this.ordenacao = new Array<SelectItem>();
		this.ordenacao.push({ label: 'Vencimento', value: 'vencimento' });
		this.ordenacao.push({ label: 'Emissão', value: 'emissao' });
		this.ordenacao.push({ label: 'Cliente', value: 'cliente' });
		this.ordenacao.push({ label: 'Valor', value: 'valor' });
	}

	private carregaCentrosCusto(): void
	{
		//inicializa o loading
		this.loading.Status = true;

		//executa consulta
		this.centroCustoService
			.pegaLista()
			.then((result) =>
			{
				if(result.IsValid)
				{
					this.centrosCusto = new Array<SelectItem>();
					this.centrosCusto.push({ label: 'Todos os registros', value: null });

					result.Items.forEach((item, index, array) =>
					{
						let tipo = item.Tipo == 'D' ? 'Despesa' : 'Receita';
						let nome = tipo + ' - ' + item.Nome;

						this.centrosCusto.push({ label: nome, value: item.Id });
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

	private carregaLista(): void
	{
		//inicializa o loading
		this.loading.Status = true;

		//configura o filtro
		this.processaFiltro();

		//executa consulta
		this.lancamentoService
			.pegaLista(this.filtro, 1, 10000)
			.then((result) =>
			{
				if(result.IsValid)
				{
					this.vm = result;
					console.log(this.vm);
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
				this.showReport = true;
			});
	}

	private processaFiltro(): void
	{
		if(this.filtro.TipoValue == null)
			this.filtro.TipoFilter = false;
		else
			this.filtro.TipoFilter = true;

		if(this.filtro.PedidoValue)
			this.filtro.PedidoFilter = true;
		else
			this.filtro.PedidoFilter = false;

		if(this.filtro.ClienteValue != null)
			this.filtro.ClienteFilter = true;
		else
			this.filtro.ClienteFilter = false;

		if(this.filtro.CaminhaoValue)
			this.filtro.CaminhaoFilter = true;
		else
			this.filtro.CaminhaoFilter = false;

		if(this.filtro.ProprietarioValue)
			this.filtro.ProprietarioFilter = true;
		else
			this.filtro.ProprietarioFilter = false;

		if(this.filtro.FormaPagamentoValue)
			this.filtro.FormaPagamentoFilter = true;
		else
			this.filtro.FormaPagamentoFilter = false;

		if(this.filtro.ContaBancariaValue)
			this.filtro.ContaBancariaFilter = true;
		else
			this.filtro.ContaBancariaFilter = false;

		if(this.filtro.CentroCustoValue)
			this.filtro.CentroCustoFilter = true;
		else
			this.filtro.CentroCustoFilter = false;

		if(this.filtro.TipoDocumentoValue)
			this.filtro.TipoDocumentoFilter = true;
		else
			this.filtro.TipoDocumentoFilter = false;

		if(this.filtro.FavorecidoValue)
			this.filtro.FavorecidoFilter = true;
		else
			this.filtro.FavorecidoFilter = false;

		if(this.filtro.AutorizadoValue != null)
			this.filtro.AutorizadoFilter = true;
		else
			this.filtro.AutorizadoFilter = false;

		//data emissao
		if(this.filtro.EmissaoMinValue == undefined)
			this.filtro.EmissaoMinValue = null;

		if(this.filtro.EmissaoMaxValue == undefined)
			this.filtro.EmissaoMaxValue = null;

		if(this.filtro.EmissaoMinValue != null || this.filtro.EmissaoMaxValue != null)
		{
			this.filtro.EmissaoFilter = true;
		}
		else
		{
			this.filtro.EmissaoFilter = false;
		}

		//data vencimento
		if(this.filtro.VencimentoMinValue == undefined)
			this.filtro.VencimentoMinValue = null;

		if(this.filtro.VencimentoMaxValue == undefined)
			this.filtro.VencimentoMaxValue = null;

		if(this.filtro.VencimentoMinValue != null || this.filtro.VencimentoMaxValue != null)
		{
			this.filtro.VencimentoFilter = true;
		}
		else
		{
			this.filtro.VencimentoFilter = false;
		}

	}

	private edita(item: Lancamento): void
	{
		let title = 'Editando: ' + item.Id;
		let data =
		{
			id: item.Id
		};

		const ref = this.modalService.open(LancamentoEditaComponent,
		{
			header: title,
			data: data,
			width: '80%'
		});

		ref.onClose.subscribe((result: Lancamento) =>
		{
			this.carregaLista();
		});
	}

	private baixa(item: Lancamento): void
	{
		let title = 'Baixando: ' + item.Id;
		let data =
		{
			id: 0,
			idLancamento: item.Id
		};

		const ref = this.modalService.open(LancamentoBaixaComponent,
		{
			header: title,
			data: data,
			width: '40%'
		});

		ref.onClose.subscribe((result: Lancamento) =>
		{
			if(result != null)
			{
				this.carregaLista();
			}
		});
	}

	private autoriza(item: Lancamento): void
	{
		//verifica dados da autorizacao
		if(item.Autorizado == true)
		{
			item.DataAutorizacao = CommonHelper.getToday();
			item.UsuarioAutorizacao = this.globalService.currentUser.Nome;
		}
		else
		{
			item.DataAutorizacao = null;
			item.UsuarioAutorizacao = '';
		}

		//salva
		this.lancamentoService
			.atualiza(item)
			.then((result) =>
			{
				if(result.IsValid)
				{
					//mostra toaster
					this.carregaLista();

					//mostra toaster
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

	public verificaTipo(tipo: string): boolean
	{
		let items = this.vm.Items.filter(a => a.Tipo == tipo).length;

		if(items > 0)
			return true;
		else
			return false;
	}

	public filtraLista(tipo: string): Array<Lancamento>
	{
		//faz o filtro
		let lista = this.vm.Items.filter(a => a.Tipo == tipo);

		//verifica ordenacao
		switch (this.orderby) {
			case 'vencimento':
				lista = lista.sort((a, b) => (a.DataVencimento > b.DataVencimento) ? 1 : -1);
				break;
			case 'emissao':
				lista = lista.sort((a, b) => (a.DataEmissao > b.DataEmissao) ? 1 : -1);
				break;
			case 'cliente':
				lista = lista.sort((a, b) => (a.Cliente.RazaoSocial > b.Cliente.RazaoSocial) ? 1 : -1);
				break;
			case 'valor':
				lista = lista.sort((a, b) => (a.ValorLiquido < b.ValorLiquido) ? 1 : -1);
				break;
			default:
				break;
		}

		//retona a lista
		return lista;
	}

	public trataDownload()
	{
		//let relatorio = this.vm.Items;

		let relatorio = [];

		relatorio = this.vm.Items

		var wb: XLSX.WorkBook = XLSX.utils.book_new();
		if(relatorio != null && relatorio.length > 0){

			let snBoleto: string = "Contas a Pagar e Receber";
			let aoaRelatorio: any[][] = [];

			//Extraindo o relatório

			aoaRelatorio.push(["Tipo", "CTE", "OS", "Emissão","Vencimento", "Cliente",
							  "Caminhão", "Pagamento", "Valor"])
					relatorio.forEach(item => {
						aoaRelatorio.push([item.Tipo, item.Pedido.CTe, item.Pedido.OrdemServico, this.formataData(item.DataEmissao), this.formataData(item.DataVencimento),
							  		 item.Cliente.RazaoSocial, item.Caminhao.Placa, item.FormaPagamento.Nome, this.valor(item.ValorLiquido)])
					});

					aoaRelatorio.push([""]);

			var ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoaRelatorio);
			XLSX.utils.book_append_sheet(wb, ws, snBoleto);

			var wscols = [
				{wch:30},
				{wch:30},
				{wch:30},
				{wch:30},
				{wch:30},
				{wch:30},
				{wch:30},
				{wch:30},
				{wch:30},
				{wch:30},
				{wch:30}
			];

			ws['!cols'] = wscols;

		}else{

			alert("Sem dados a serem impressos!");
		}

		XLSX.writeFile(wb, 'report.xlsx')

	}

	private formataData(data: string){

		let dataConvertida = new Date(data)

		if(data != null ){

		let dataFormatada = ((dataConvertida.getDate() )) + "/" + ((dataConvertida.getMonth() + 1)) + "/" + dataConvertida.getFullYear();

		return dataFormatada;
		}

	}

	private valor(valor:number){


	let valorFormatado = valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

	return valorFormatado;
	}


	public pegaTotal(tipo: string): number
	{
		let total = this.vm.Items.filter(a => a.Tipo == tipo)
								 .map(a => a.ValorSaldo)
								 .reduce((a, b) => a + b, 0);

		return total;
	}

	public pegaSaldo(): number
	{
		let debito = this.pegaTotal('D');
		let credito = this.pegaTotal('C');

		return credito - debito;
	}

	public onEdita_Click(item: Lancamento): void
	{
		this.edita(item);
	}

	public onBaixa_Click(item: Lancamento): void
	{
		this.baixa(item);
	}

	public onGerar_Click(): void
	{
		this.carregaLista();
	}

	public onAutorizacao_Change(item: Lancamento): void
	{
		this.autoriza(item);
	}
	public onExportXls_Click(){

			this.trataDownload();

		}

}
