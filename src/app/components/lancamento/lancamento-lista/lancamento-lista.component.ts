import { Component, OnInit } from '@angular/core';
import { ListResult } from 'src/app/helpers/list-result.helper';
import { Lancamento } from 'src/app/models/lancamento.model';
import { LancamentoFilter } from 'src/app/filters/lancamento.filter';
import { SelectItem } from 'primeng/api/selectitem';
import { Loading } from 'src/app/helpers/loading.helper';
import { GlobalService } from 'src/app/services/global.service';
import { LancamentoService } from 'src/app/services/lancamento.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { CaminhaoService } from 'src/app/services/caminhao.service';
import { FormaPagamentoService } from 'src/app/services/forma-pagamento.service';
import { DialogService } from 'primeng/dynamicdialog';
import { DialogServiceHelper } from 'src/app/services/dialog.service';
import { CommonHelper } from 'src/app/helpers/common.helper';
import { ClienteFilter } from 'src/app/filters/cliente.filter';
import { DialogTypeEnum } from 'src/app/enums/dialog-type.enum';
import { CaminhaoFilter } from 'src/app/filters/caminhao.filter';
import { PedidoFilter } from 'src/app/filters/pedido.filter';
import { LancamentoEditaComponent } from '../lancamento-edita/lancamento-edita.component';
import { LancamentoBaixaComponent } from '../lancamento-baixa/lancamento-baixa.component';
import { Pedido } from 'src/app/models/pedido.model';
import { PedidoEditaComponent } from '../../pedido/pedido-edita/pedido-edita.component';
import * as XLSX from 'xlsx';




@Component({
	selector: 'app-lancamento-lista',
	templateUrl: './lancamento-lista.component.html',
	styleUrls: ['./lancamento-lista.component.css']
})
export class LancamentoListaComponent implements OnInit
{
	public vm: ListResult<Lancamento> = new ListResult<Lancamento>();
	public filtro: LancamentoFilter = new LancamentoFilter();
	public pedidos: SelectItem[];
	public clientes: SelectItem[];
	public caminhoes: SelectItem[];
	public formasPagamento: SelectItem[];
	public tipos: SelectItem[];
	public baixado: SelectItem[];
	public filtroDataEmissao: Date[];
	public filtroDataVencimento: Date[];
	public filtroDataBaixa: Date[];
	public loading: Loading = new Loading();
	public localeBR: any;
	public dados: ListResult<Lancamento> = new ListResult<Lancamento>();

	constructor(public globalService: GlobalService,
		private lancamentoService: LancamentoService,
		private pedidoService: PedidoService,
		private clienteService: ClienteService,
		private caminhaoService: CaminhaoService,
		private formaPagamentoService: FormaPagamentoService,
		private modalService: DialogService,
		private dialogService: DialogServiceHelper)
	{

	}

	ngOnInit()
	{
		this.inicializa();
	}

	private inicializa(): void
	{

		this.globalService.verificaLogado();
		this.localeBR = CommonHelper.calendarLocale();
		this.carregaBreadcrumb();
		this.carregaTipos();
		this.carregaStatus();
		this.carregaPedidos();
		this.carregaClientes();
		this.carregaCaminhoes();
		this.carregaFormasPagamento();
		this.carregaLista();
		this.carregaListaCompleta();
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
				label: 'Cadastro'
			},
			{
				label: 'Lançamentos Financeiros'
			}
		];
	}

	private carregaTipos(): void
	{
		this.tipos = new Array<SelectItem>();

		this.tipos.push({ label: 'Todos', value: null });
		this.tipos.push({ label: 'C', value: 'C' });
		this.tipos.push({ label: 'D', value: 'D' });
	}

	private carregaStatus(): void
	{
		this.baixado = new Array<SelectItem>();

		this.baixado.push({ label: 'Todos', value: null });
		this.baixado.push({ label: 'Não', value: false });
		this.baixado.push({ label: 'Sim', value: true });
	}

	private carregaPedidos(): void
	{
		//inicializa o loading
		this.loading.Status = true;

		//filtro
		let filter = new PedidoFilter();
		filter.AtivoFilter = true;
		filter.AtivoValue = true;

		//executa consulta
		this.pedidoService
			.pegaLista(filter, 1, 10000)
			.then((result) =>
			{
				if(result.IsValid)
				{
					this.pedidos = new Array<SelectItem>();
					this.pedidos.push({ label: 'Todos os registros', value: null });

					result.Items.forEach((item, index, array) =>
					{
						let nome = 'OS: ' + item.OrdemServico;
						nome += item.CTe ? ' - CTe: ' + item.CTe : ''
						nome += item.NFe ? ' - NFe: ' + item.NFe : '';

						this.pedidos.push({ label: nome, value: item.Id });
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
	private carregaListaCompleta(): void
	{

		//inicializa o loading
		this.loading.Status = true;

		//configura o filtro
		this.processaFiltro();

		//executa consulta
		this.lancamentoService
			.pegaListaCompleta(this.filtro)
			.then((result) =>
			{

				if(result.IsValid)
				{
					this.dados = result;
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

	private carregaLista(): void
	{
		//inicializa o loading
		this.loading.Status = true;

		//configura o filtro
		this.processaFiltro();

		//executa consulta
		this.lancamentoService
			.pegaLista(this.filtro, this.vm.CurrentPage, this.vm.PageSize)
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

		if(this.filtro.FormaPagamentoValue)
			this.filtro.FormaPagamentoFilter = true;
		else
			this.filtro.FormaPagamentoFilter = false;

		if(this.filtro.FavorecidoValue)
			this.filtro.FavorecidoFilter = true;
		else
			this.filtro.FavorecidoFilter = false;

		//data emissao
		if(this.filtroDataEmissao != null  && this.filtroDataEmissao != undefined)
		{
			this.filtro.EmissaoFilter = true;
			this.filtro.EmissaoMinValue = this.filtroDataEmissao[0];
			if(this.filtroDataEmissao[1] != null && this.filtroDataEmissao[1] != undefined)
				this.filtro.EmissaoMaxValue = this.filtroDataEmissao[1];
			else
				this.filtro.EmissaoMaxValue = this.filtro.EmissaoMinValue;
		}
		else
		{
			this.filtro.EmissaoFilter = false;
			this.filtro.EmissaoMinValue = null;
			this.filtro.EmissaoMaxValue = null;
		}

		//data vencimento
		if(this.filtroDataVencimento != null  && this.filtroDataVencimento != undefined)
		{
			this.filtro.VencimentoFilter = true;
			this.filtro.VencimentoMinValue = this.filtroDataVencimento[0];
			if(this.filtroDataVencimento[1] != null && this.filtroDataVencimento[1] != undefined)
				this.filtro.VencimentoMaxValue = this.filtroDataVencimento[1];
			else
				this.filtro.VencimentoMaxValue = this.filtro.VencimentoMinValue;
		}
		else
		{
			this.filtro.VencimentoFilter = false;
			this.filtro.VencimentoMinValue = null;
			this.filtro.VencimentoMaxValue = null;
		}

		//data finalizado
		if(this.filtroDataBaixa != null  && this.filtroDataBaixa != undefined)
		{
			this.filtro.BaixaFilter = true;
			this.filtro.BaixaMinValue = this.filtroDataBaixa[0];
			if(this.filtroDataBaixa[1] != null && this.filtroDataBaixa[1] != undefined)
				this.filtro.BaixaMaxValue = this.filtroDataBaixa[1];
			else
				this.filtro.BaixaMaxValue = this.filtro.BaixaMinValue;
		}
		else
		{
			this.filtro.BaixaFilter = false;
			this.filtro.BaixaMinValue = null;
			this.filtro.BaixaMaxValue = null;
		}

		if(this.filtro.ValorLiquidoValue)
			this.filtro.ValorLiquidoFilter = true;
		else
			this.filtro.ValorLiquidoFilter = false;

		if(this.filtro.ValorBaixadoValue)
			this.filtro.ValorBaixadoFilter = true;
		else
			this.filtro.ValorBaixadoFilter = false;

		if(this.filtro.DescricaoValue)
			this.filtro.DescricaoFilter = true;
		else
			this.filtro.DescricaoFilter = false;

		if(this.filtro.BaixadoValue == null)
		{
			this.filtro.BaixadoFilter = false;
		}
		else
		{
			this.filtro.BaixadoFilter = true;
		}
	}

	private deleta(item: Lancamento): void
	{
		this.loading.Status = true;

		this.lancamentoService
			.deleta(item.Id)
			.then((result) =>
			{
				if(result.IsValid)
				{
					this.carregaLista();
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

	private adiciona(): void
	{
		let title = 'Novo Registro';
		let data =
		{
			id: 0
		};

		const ref = this.modalService.open(LancamentoEditaComponent,
		{
			header: title,
			data: data,
			width: '80%'
		});

		ref.onClose.subscribe((result: Lancamento) =>
		{
			if(result != null)
			{
				this.carregaLista();
			}
		});
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

	private estorna(item: Lancamento): void
	{
		this.loading.Status = true;

		this.lancamentoService
			.estorna(item)
			.then((result) =>
			{
				if(result.IsValid)
				{
					this.carregaLista();
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

	private pedidoEdita(item: Pedido): void
	{
		let title = 'Editando: ' + item.OrdemServico;
		let data =
		{
			id: item.Id
		};

		const ref = this.modalService.open(PedidoEditaComponent,
		{
			header: title,
			data: data,
			width: '80%'
		});
	}

	private trataDownload(){

		let boleto = [];

		this.dados.Items.forEach(item => {

			if (item.FormaPagamento.Id == 13){

				boleto.push(item);
			}
		});


		var wb: XLSX.WorkBook = XLSX.utils.book_new();

		if(boleto != null && boleto.length > 0){

			const snBoleto: string = "Boletos a Fazer";
			let aoaBoleto: any[][] = [];

			//Extraindo o relatório]

			aoaBoleto.push(["CTE", "NF", "Emissão", "Cliente", "Valor"])
					boleto.forEach(item => {
						aoaBoleto.push([item.Pedido ? item.Pedido.CTe: "Não informado", item.Pedido ? item.Pedido.NFe:"Não Informado" , this.formataData(item.DataEmissao),
							  		 item.Cliente.RazaoSocial, this.valor(item.ValorSaldo)])
					});

				aoaBoleto.push([""]);

			var ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoaBoleto);
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

	public onAdiciona_Click(): void
	{
		this.adiciona();
	}

	public onEdita_Click(item: Lancamento): void
	{
		this.edita(item);
	}

	public onBaixa_Click(item: Lancamento): void
	{
		this.baixa(item);
	}

	public onEstorna_Click(item: Lancamento): void
	{
		let title = 'Confirmação de estorno';
		let message = 'Tem certeza que deseja estornar a baixa do registro ' + item.Id + '?'

		this.dialogService.confirm(title, message, () => {
			this.estorna(item)
		}, null);
	}

	public onDeleta_Click(item: Lancamento): void
	{
		let title = 'Confirmação de exclusão';
		let message = 'Tem certeza que deseja excluir o registro ' + item.Id + '?'

		this.dialogService.confirm(title, message, () => {
			this.deleta(item)
		}, null);
	}

	public onPedidoEdita_Click(item: Pedido): void
	{
		this.pedidoEdita(item);
	}

	public onFilter_Click(): void
	{
		this.vm.CurrentPage = 1;
		this.carregaLista();
	}

	public onPage_Change(event: any): void
	{
		this.vm.CurrentPage = event.page + 1;
		this.carregaLista();
	}

	public onExportXls_Click(){
	// id forma de pagameto dos boletos é 13
		this.carregaListaCompleta();
		this.trataDownload();
	}
}
