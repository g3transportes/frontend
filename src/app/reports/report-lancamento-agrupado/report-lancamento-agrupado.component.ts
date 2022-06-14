import { Component, OnInit, Input } from '@angular/core';
import { LancamentoFilter } from 'src/app/filters/lancamento.filter';
import { ListResult } from 'src/app/helpers/list-result.helper';
import { LancamentoResumo, LancamentoResumoItem } from 'src/app/viewmodels/lancamento-resumo.model';
import { SelectItem } from 'primeng/api/selectitem';
import { Loading } from 'src/app/helpers/loading.helper';
import { GlobalService } from 'src/app/services/global.service';
import { LancamentoService } from 'src/app/services/lancamento.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { CaminhaoService } from 'src/app/services/caminhao.service';
import { ProprietarioService } from 'src/app/services/proprietario.service';
import { DialogService } from 'primeng/dynamicdialog';
import { DialogServiceHelper } from 'src/app/services/dialog.service';
import { ActivatedRoute, Router, RouteReuseStrategy } from '@angular/router';
import { CommonHelper } from 'src/app/helpers/common.helper';
import { ClienteFilter } from 'src/app/filters/cliente.filter';
import { CaminhaoFilter } from 'src/app/filters/caminhao.filter';
import { DialogTypeEnum } from 'src/app/enums/dialog-type.enum';
import { ProprietarioFilter } from 'src/app/filters/proprietario.filter';
import { LancamentoEditaComponent } from 'src/app/components/lancamento/lancamento-edita/lancamento-edita.component';
import { LancamentoBaixaComponent } from 'src/app/components/lancamento/lancamento-baixa/lancamento-baixa.component';
import { Lancamento } from 'src/app/models/lancamento.model';
import { CentroCustoService } from 'src/app/services/centro-custo.service';
import {CentroCusto} from '../../models/centro-custo.model';
import {ResumoConta} from '../../viewmodels/resumo-conta.model';
import { Cliente } from 'src/app/models/cliente.model';
import * as XLSX from 'xlsx';






@Component({
	selector: 'app-report-lancamento-agrupado',
	templateUrl: './report-lancamento-agrupado.component.html',
	styleUrls: ['./report-lancamento-agrupado.component.css'],
	providers: [ DialogService ]
})
export class ReportLancamentoAgrupadoComponent implements OnInit
{
	@Input() public filtro: LancamentoFilter;
	public vm : ListResult<LancamentoResumo> = new ListResult<LancamentoResumo>();
	public reportType = '';
	public tipos: SelectItem[];
	public clientes: SelectItem[];
	public caminhoes: SelectItem[];
	public proprietarios: SelectItem[];
	public ccustos: SelectItem[];
	public listaCusto: Array<CentroCusto> = new Array<CentroCusto>();
	public resumoCusto: Array<ResumoConta> = new Array<ResumoConta>();
	public mostraReceber = true;
	public mostraRecebido = true;
	public mostraPagar = true;
	public mostraPago = true;
	public loading: Loading = new Loading();
	public localeBR: any;
	public showReport = false;

	constructor(public globalService: GlobalService,
		private lancamentoService: LancamentoService,
		private clienteService: ClienteService,
		private caminhaoService: CaminhaoService,
		private proprietarioService: ProprietarioService,
		private centroCustoService: CentroCustoService,
		private modalService: DialogService,
		private dialogService: DialogServiceHelper,
		private router: Router,
		private activatedRoute: ActivatedRoute)
	{
		this.router.routeReuseStrategy.shouldReuseRoute = () => false;
	}

	ngOnInit(): void
	{
		this.inicializa();
	}

	private inicializa(): void
	{
		this.globalService.verificaLogado();
		this.localeBR = CommonHelper.calendarLocale();
		this.activatedRoute.params.subscribe(params => this.reportType = params.tipo);

		// verifica filtro
		if(this.filtro == null)
			this.filtro = new LancamentoFilter();

		this.carregaBreadcrumb();
		this.carregaTipos()
		this.carregaClientes();
		this.carregaCaminhoes();
		this.carregaProprietarios();
		this.carregaCentrosCusto();
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
				label: 'Lançamentos Agrupados'
			},
			{
				label: this.reportType.toUpperCase()
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
		// inicializa o loading
		this.loading.Status = true;

		// filtro
		const filter = new ClienteFilter();
		filter.AtivoFilter = true;
		filter.AtivoValue = true;

		// executa consulta
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
		// inicializa o loading
		this.loading.Status = true;

		// filtro
		const filter = new CaminhaoFilter();
		filter.AtivoFilter = true;
		filter.AtivoValue = true;

		// executa consulta
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
						const motorista = item.Motorista != null ? item.Motorista.Nome : 'Sem motorista'
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
		// inicializa o loading
		this.loading.Status = true;

		// filtro
		const filter = new ProprietarioFilter();
		filter.AtivoFilter = true;
		filter.AtivoValue = true;

		// executa consulta
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
					// carrega lista
					this.listaCusto = result.Items;

					// cria resumo
					this.ccustos = new Array<SelectItem>();
					this.ccustos.push({ label: 'Todos os registros', value: null });

					result.Items.forEach((item, index, array) =>
					{
						const nome = '[' + item.Tipo + '] ' + item.Nome;
						this.ccustos.push({ label: nome, value: item.Id });
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
		switch (this.reportType)
		{
			case 'cliente':
				this.carregaListaCliente();
				break;
			case 'caminhao':
				this.carregaListaCaminhao();
				break;
			case 'proprietario':
				this.carregaListaProprietario();
				break;
			case 'plano-conta':
				this.carregaListaCusto();
				break;
			default:
				this.carregaListaCliente();
				break;
		}
	}

	private carregaListaCliente(): void
	{
		// inicializa o loading
		this.loading.Status = true;

		// configura o filtro
		this.processaFiltro();

		// executa consulta
		this.lancamentoService
			.pegaResumoCliente(this.filtro)
			.then((result) =>
			{
				if(result.IsValid)
				{
					this.vm = result;

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

	private carregaListaCaminhao(): void
	{
		// inicializa o loading
		this.loading.Status = true;

		// configura o filtro
		this.processaFiltro();

		// executa consulta
		this.lancamentoService
			.pegaResumoCaminhao(this.filtro)
			.then((result) =>
			{
				if(result.IsValid)
				{
					this.vm = result;
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

	private carregaListaProprietario(): void
	{
		// inicializa o loading
		this.loading.Status = true;

		// configura o filtro
		this.processaFiltro();

		// executa consulta
		this.lancamentoService
			.pegaResumoProprietario(this.filtro)
			.then((result) =>
			{
				if(result.IsValid)
				{
					this.vm = result;
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

	private carregaListaCusto(): void
	{
		// inicializa o loading
		this.loading.Status = true;

		// configura o filtro
		this.processaFiltro();

		// executa consulta
		this.lancamentoService
			.pegaResumoCentroCusto(this.filtro)
			.then((result) =>
			{
				if(result.IsValid)
				{
					this.vm = result;

					console.log(this.vm);

					// carrega o resumo
					this.carregaResumoCusto();
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
				this.showReport = true;
			});
	}

	private processaFiltro(): void
	{
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

		if(this.filtro.CentroCustoValue)
			this.filtro.CentroCustoFilter = true;
		else
			this.filtro.CentroCustoFilter = false;

		// data emissao
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

		// data vencimento
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

	private carregaResumoCusto(): void
	{
		// carrega as categorias
		const categorias = this.listaCusto.filter(a => a.UltimoNivel === false);

		// inicializa lista do resumo
		this.resumoCusto = new Array<ResumoConta>();

		// faz loop nas categorias
		categorias.forEach((value, index, array) =>
		{
			const itens = this.vm.Items.filter(a => a.Referencia.startsWith(value.Referencia));
			const totalPagar = itens.map(a => a.TotalPagar).reduce((a, b) => a + b, 0);
			const totalPago = itens.map(a => a.TotalPago).reduce((a, b) => a + b, 0);
			const totalReceber = itens.map(a => a.TotalReceber).reduce((a, b) => a + b, 0);
			const totalRecebido = itens.map(a => a.TotalRecebido).reduce((a, b) => a + b, 0);

			const resumoItem = new ResumoConta();
			resumoItem.Referencia = value.Referencia;
			resumoItem.Descricao = value.Nome;
			resumoItem.Debito = totalPagar + totalPago;
			resumoItem.Credito = totalReceber + totalRecebido;
			resumoItem.Saldo = resumoItem.Credito - resumoItem.Debito;

			this.resumoCusto.push(resumoItem);
		});


	}

	public pegaTotalResumo(): ResumoConta
	{
		const resumo = new ResumoConta();
		resumo.Descricao = 'Total';
		resumo.Debito = this.resumoCusto.map(a => a.Debito).reduce((a, b) => a + b, 0);
		resumo.Credito = this.resumoCusto.map(a => a.Credito).reduce((a, b) => a + b, 0);
		resumo.Saldo = this.resumoCusto.map(a => a.Saldo).reduce((a, b) => a + b, 0);

		return resumo;
	}

	 public async trataDownload() {

		let receber = [];
		let recebido = [];
		let pago = [];
		let pagar = [];

		//validações para separar os filtros

		if(this.mostraReceber == true){

			this.vm.Items.forEach(item => {

				if (item.ItemsReceber.length > 0){

					receber.push(item);
				}
			});
		}

		if(this.mostraRecebido == true){

			this.vm.Items.forEach(item => {

				if (item.ItemsRecebido.length > 0){

					recebido.push(item);
				}

			});

		}

		if(this.mostraPagar == true) {

			this.vm.Items.forEach(item => {

				if (item.ItemsPagar.length > 0){

					pagar.push(item);
				}

			});

		}

		if(this.mostraPago == true ){


			this.vm.Items.forEach(item => {

				if (item.ItemsPago.length > 0){

					pago.push(item);
				}
			});
		}

		var wb: XLSX.WorkBook = XLSX.utils.book_new();

		//receber
		if(receber != null && receber.length > 0){

			const snReceber: string = "Receber";
			let aoaReceber: any[][] = [];
			let merge = []

			//Fornecedor

			receber.forEach(cliente => {

				aoaReceber.push([cliente.Nome])
				merge.push({s:{r:aoaReceber.length - 1, c:0}, e:{r:aoaReceber.length - 1, c:1}})
				aoaReceber.push(["Tipo", "Coleta", "Vencimento","Baixa", "Pedido", "Cliente",
							  "Caminhão", "Remetente", "Liquido", "Baixado", "Saldo"])

				if(cliente.ItemsReceber.length > 0){
					cliente.ItemsReceber.forEach(item => {
						aoaReceber.push([item.Tipo, this.formataData(item.Coleta),this.formataData(item.Vencimento), item.Baixa,
							item.NumPedido, item.Cliente, item.Motorista, item.Remetente, this.valor(item.Valor),
							this.valor(item.ValorBaixado), this.valor(item.ValorSaldo)])
					});
				}
				aoaReceber.push([""]);
			});


			var ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoaReceber);
			XLSX.utils.book_append_sheet(wb, ws, snReceber);

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
			ws['!merges'] = merge;
		}

		// Recebidos
		if(recebido != null && recebido.length > 0){

			const snRecebido: string = "Recebidos";
			let aoaRecebido: any[][] = [];
			let merge = []
			//Fornecedor
			recebido.forEach(cliente => {

				aoaRecebido.push([cliente.Nome])
				merge.push({s:{r:aoaRecebido.length - 1, c:0}, e:{r:aoaRecebido.length - 1, c:1}})
				aoaRecebido.push(["Tipo", "Coleta", "Vencimento","Baixa", "Pedido", "Cliente",
							  "Caminhão", "Remetente", "Liquido", "Baixado"])

				if(cliente.ItemsRecebido.length > 0){
					cliente.ItemsRecebido.forEach(item => {
						aoaRecebido.push([item.Tipo,this.formataData(item.Coleta),this.formataData(item.Vencimento), item.Baixa,
							 item.NumPedido, item.Cliente, item.Motorista, item.Remetente, this.valor(item.Valor),
							 this.valor(item.ValorBaixado)])
					});
				}
				aoaRecebido.push([""]);
			});
			var ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoaRecebido);
			XLSX.utils.book_append_sheet(wb, ws, snRecebido);

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
			ws['!merges'] = merge;

		}

		// pagar
		if(pagar != null && pagar.length > 0){

			const snPagar: string = "Pagar";
			let aoaPagar: any[][] = [];
			let merge = []
			//Fornecedor
			pagar.forEach(cliente => {

				aoaPagar.push([cliente.Nome])
				merge.push({s:{r:aoaPagar.length - 1, c:0}, e:{r:aoaPagar.length - 1, c:1}})
				aoaPagar.push(["Tipo", "Coleta", "Vencimento","Baixa", "Pedido", "Cliente",
							  "Caminhão", "Remetente", "Liquido", "Baixado", "Saldo"])

				if(cliente.ItemsPagar.length > 0){

					cliente.ItemsPagar.forEach(item => {
						aoaPagar.push([item.Tipo, this.formataData(item.Coleta),this.formataData(item.Vencimento), item.Baixa,
							 item.NumPedido, item.Cliente, item.Motorista, item.Remetente, this.valor(item.Valor),
							 this.valor(item.ValorBaixado), this.valor(item.ValorSaldo)])
					});
				}
				aoaPagar.push([""]);
			});
			var ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoaPagar);
			XLSX.utils.book_append_sheet(wb, ws, snPagar);

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
			ws['!merges'] = merge;
		}

		//pagos

		if(pago != null && pago.length > 0){

			const snPago: string = "Pagos";
			let aoaPago: any[][] = [];
			let merge = []
			//Fornecedor
			pago.forEach(cliente => {
				aoaPago.push([cliente.Nome])
				merge.push({s:{r:aoaPago.length - 1, c:0}, e:{r:aoaPago.length - 1, c:1}})
				aoaPago.push(["Tipo", "Coleta", "Vencimento","Baixa", "Pedido", "Cliente",
							  "Caminhão", "Remetente", "Liquido", "Baixado"])
				if(cliente.ItemsPago.length > 0){
					cliente.ItemsPago.forEach(item => {
						aoaPago.push([item.Tipo, this.formataData(item.Coleta),this.formataData(item.Vencimento), this.formataData(item.Baixa),
							 item.NumPedido, item.Cliente, item.Caminhao, item.Remetente, this.valor(item.Valor),
							 this.valor(item.ValorBaixado)])
					});
				}
				aoaPago.push([""]);
			});

			var ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoaPago);
			XLSX.utils.book_append_sheet(wb, ws, snPago);

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
			ws['!merges'] = merge;
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

	private edita(item: LancamentoResumoItem): void
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
			width: '70%'
		});

		ref.onClose.subscribe((result: Lancamento) =>
		{
			this.carregaLista();
		});
	}

	private baixa(item: LancamentoResumoItem): void
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
				this.carregaLista();
			}
		});
	}

	public onEdita_Click(item: LancamentoResumoItem): void
	{
		this.edita(item);
	}

	public onEditaBaixa_Click(item: LancamentoResumoItem): void
	{
		this.edita(item);
	}

	public onDeleta_Click(item: LancamentoResumoItem): void
	{
		this.edita(item);
	}

	public onDeletaBaixa_Click(item: LancamentoResumoItem): void
	{
		this.edita(item);
	}

	public onBaixa_Click(item: LancamentoResumoItem): void
	{
		this.baixa(item);
	}

	public onGerar_Click(): void
	{
		this.carregaLista();
	}

	public onExportXls_Click(){

		this.trataDownload();
	}
}
