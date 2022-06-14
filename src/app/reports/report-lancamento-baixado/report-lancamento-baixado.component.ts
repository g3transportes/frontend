import { Component, OnInit, Input } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { LancamentoBaixaFilter } from 'src/app/filters/lancamento-baixa.filter';
import { ListResult } from 'src/app/helpers/list-result.helper';
import { LancamentoBaixa } from 'src/app/models/lancamento-baixa.model';
import { SelectItem } from 'primeng/api/selectitem';
import { Loading } from 'src/app/helpers/loading.helper';
import { GlobalService } from 'src/app/services/global.service';
import { LancamentoBaixaService } from 'src/app/services/lancamento-baixa.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { CaminhaoService } from 'src/app/services/caminhao.service';
import { FormaPagamentoService } from 'src/app/services/forma-pagamento.service';
import { DialogServiceHelper } from 'src/app/services/dialog.service';
import { CommonHelper } from 'src/app/helpers/common.helper';
import { LancamentoFilter } from 'src/app/filters/lancamento.filter';
import { ClienteFilter } from 'src/app/filters/cliente.filter';
import { DialogTypeEnum } from 'src/app/enums/dialog-type.enum';
import { CaminhaoFilter } from 'src/app/filters/caminhao.filter';
import { ItemResult } from 'src/app/helpers/item-result.helper';
import { LancamentoBaixaComponent } from 'src/app/components/lancamento/lancamento-baixa/lancamento-baixa.component';
import { ContaBancariaService } from 'src/app/services/conta-bancaria.service';
import { CentroCustoService } from 'src/app/services/centro-custo.service';
import { TipoDocumentoService } from 'src/app/services/tipo-documento.service';
import { ProprietarioService } from 'src/app/services/proprietario.service';
import { ProprietarioFilter } from 'src/app/filters/proprietario.filter';
import * as XLSX from 'xlsx';
import { Lancamento } from './../../models/lancamento.model';

@Component({
	selector: 'app-report-lancamento-baixado',
	templateUrl: './report-lancamento-baixado.component.html',
	styleUrls: ['./report-lancamento-baixado.component.css'],
	providers: [ DialogService ]
})
export class ReportLancamentoBaixadoComponent implements OnInit
{
	@Input() public filtro: LancamentoBaixaFilter;
	public vm : ListResult<LancamentoBaixa> = new ListResult<LancamentoBaixa>();
	public tipos: SelectItem[];
	public clientes: SelectItem[];
	public caminhoes: SelectItem[];
	public proprietarios: SelectItem[];
	public formasPagamento: SelectItem[];
	public contasBancarias: SelectItem[];
	public centrosCusto: SelectItem[];
	public tiposDocumento: SelectItem[];
	public loading: Loading = new Loading();
	public localeBR: any;
	public showReport: boolean = false;

	constructor(public globalService: GlobalService,
		private lancamentoBaixaService: LancamentoBaixaService,
		private clienteService: ClienteService,
		private caminhaoService: CaminhaoService,
		private proprietarioService: ProprietarioService,
		private formaPagamentoService: FormaPagamentoService,
		private contaBancariaService: ContaBancariaService,
		private centroCustoService: CentroCustoService,
		private tipoDocumentoService: TipoDocumentoService,
		private modalService: DialogService,
		private dialogService: DialogServiceHelper)
	{

	}

	ngOnInit(): void
	{
		this.inicializa()
	}

	private inicializa(): void
	{
		this.globalService.verificaLogado();
		this.localeBR = CommonHelper.calendarLocale();

		//verifica filtro
		if(this.filtro == null)
			this.filtro = new LancamentoBaixaFilter();

		this.carregaBreadcrumb();
		this.carregaTipos()
		this.carregaClientes();
		this.carregaCaminhoes();
		this.carregaProprietarios();
		this.carregaFormasPagamento();
		this.carregaContasBancarias();
		this.carregaCentrosCusto();
		this.carregaTiposDocumento();
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
				label: 'Lançamentos Baixados'
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
		this.lancamentoBaixaService
			.pegaLista(this.filtro, 1, 10000)
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

		//data baixa
		if(this.filtro.DataMinValue == undefined)
			this.filtro.DataMinValue = null;

		if(this.filtro.DataMaxValue == undefined)
			this.filtro.DataMaxValue = null;

		if(this.filtro.DataMinValue != null || this.filtro.DataMaxValue != null)
		{
			this.filtro.DataFilter = true;
		}
		else
		{
			this.filtro.DataFilter = false;
		}

	}

	public trataDownload()
	{
		let relatorio = [];

		relatorio = this.vm.Items.sort((a, b) => (a.Tipo < b.Tipo) ? 1 : -1);

		var wb: XLSX.WorkBook = XLSX.utils.book_new();
		if(relatorio != null && relatorio.length > 0){

			let snBoleto: string = "Contas a Pagar e Receber";
			let aoaRelatorio: any[][] = [];

			//Extraindo o relatório

			aoaRelatorio.push(["Tipo", "Vencimento", "Baixa", "OS","CTE", "Cliente",
							  "Caminhão", "Forma Pagamento", "Conta", "Valor"])
					relatorio.forEach(item => {
						aoaRelatorio.push([item.Tipo, this.formataData(item.Lancamento.DataVencimento), this.formataData(item.Data),
							item.Lancamento.Pedido ? item.Lancamento.Pedido.OrdemServico : "Não Informado",
							item.Lancamento.Pedido ? item.Lancamento.Pedido.CTe: "Não Informado",
							  		 item.Lancamento.Cliente.RazaoSocial, item.Lancamento.Caminhao.Placa, item.FormaPagamento.Nome, item.Lancamento.Nome, this.valor(item.Valor)])
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


	public verificaTipo(tipo: string): boolean
	{
		let items = this.vm.Items.filter(a => a.Lancamento.Tipo == tipo).length;

		if(items > 0)
			return true;
		else
			return false;
	}

	public filtraLista(tipo: string): Array<LancamentoBaixa>
	{
		return this.vm.Items.filter(a => a.Lancamento.Tipo == tipo);
	}

	public pegaTotal(tipo: string): number
	{
		let total = this.vm.Items.filter(a => a.Lancamento.Tipo == tipo)
								 .map(a => a.Valor)
								 .reduce((a, b) => a + b, 0);

		return total;
	}

	public pegaSaldo(): number
	{
		let debito = this.pegaTotal('D');
		let credito = this.pegaTotal('C');

		return credito - debito;
	}

	private edita(item: LancamentoBaixa): void
	{
		let title = 'Edita Baixa';
		let data =
		{
			id: item.Id,
			idLancamento: item.IdLancamento
		};

		const ref = this.modalService.open(LancamentoBaixaComponent,
		{
			header: title,
			data: data,
			width: '50%'
		});

		ref.onClose.subscribe((result: ItemResult<LancamentoBaixa>) =>
		{
			this.carregaLista();
		});
	}

	private deleta(item: LancamentoBaixa): void
	{
		this.loading.Status = true;

		this.lancamentoBaixaService
			.deleta(item.Id)
			.then((result) =>
			{
				if(result.IsValid)
				{
					this.dialogService.alert('Informações do sistema', ['Baixa incluída com sucesso'], DialogTypeEnum.Sucesso, () =>
					{
						this.carregaLista();
					});
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

	public onEdita_Click(item: LancamentoBaixa): void
	{
		this.edita(item);
	}

	public onDeleta_Click(item: LancamentoBaixa): void
	{
		let title = 'Confirmação de exclusão';
		let message = 'Tem certeza que deseja excluir a baixa?'

		this.dialogService.confirm(title, message, () =>
		{
			this.deleta(item);
		}, null);
	}

	public onGerar_Click(): void
	{
		this.carregaLista();
	}

	public onExportXls_Click(){

		this.trataDownload();

	}
}
