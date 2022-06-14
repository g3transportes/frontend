import { Component, OnInit, Input } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { RemetenteEstoqueFilter } from 'src/app/filters/remetente-estoque.filter';
import { ListResult } from 'src/app/helpers/list-result.helper';
import { RemetenteEstoque } from 'src/app/models/remetente-estoque.model';
import { SelectItem } from 'primeng/api';
import { Loading } from 'src/app/helpers/loading.helper';
import { GlobalService } from 'src/app/services/global.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { DialogServiceHelper } from 'src/app/services/dialog.service';
import { RemetenteEstoqueService } from 'src/app/services/remetente-estoque.service';
import { RemetenteService } from 'src/app/services/remetente.service';
import { CommonHelper } from 'src/app/helpers/common.helper';
import { ClienteFilter } from 'src/app/filters/cliente.filter';
import { DialogTypeEnum } from 'src/app/enums/dialog-type.enum';
import { RemetenteFilter } from 'src/app/filters/remetente.filter';
import { PedidoFilter } from 'src/app/filters/pedido.filter';

@Component({
	selector: 'app-report-estoque-movimentacao',
	templateUrl: './report-estoque-movimentacao.component.html',
	styleUrls: ['./report-estoque-movimentacao.component.css'],
	providers: [ DialogService ]
})
export class ReportEstoqueMovimentacaoComponent implements OnInit 
{
	@Input() public filtro: RemetenteEstoqueFilter;
	public vm : ListResult<RemetenteEstoque> = new ListResult<RemetenteEstoque>();
	public tipos: SelectItem[];
	public remetentes: SelectItem[];
	public clientes: SelectItem[];
	public pedidos: SelectItem[];
	public loading: Loading = new Loading();
	public localeBR: any;
	public showReport: boolean = false;

	constructor(public globalService: GlobalService,
		private remetenteEstoqueService: RemetenteEstoqueService,
		private remetenteService: RemetenteService,
		private pedidoService: PedidoService,
		private clienteService: ClienteService,
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
		{
			this.filtro = new RemetenteEstoqueFilter();
			//this.filtro.AtivoFilter = true;
			//this.filtro.AtivoValue = true;
		}
			

		this.carregaBreadcrumb();
		this.carregaTipos();
		this.carregaRemetentes();
		this.carregaClientes();
		this.carregaPedidos();
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
				label: 'Movimentação de Estoque'
			}
		];
	}

	private carregaTipos(): void
	{
		this.tipos = new Array<SelectItem>();
		this.tipos.push({ label: 'Todos os tipos', value: null });
		this.tipos.push({ label: 'Entrada', value: 'C' });
		this.tipos.push({ label: 'Saída', value: 'D' });
	}

	private carregaRemetentes(): void
	{
		//inicializa o loading
		this.loading.Status = true;

		//filtro
		let filtroRemetente = new RemetenteFilter();
		filtroRemetente.AtivoFilter = true;
		filtroRemetente.AtivoValue = true;

		//executa consulta
		this.remetenteService
			.pegaLista(filtroRemetente, 1, 10000)
			.then((result) => 
			{
				if(result.IsValid)
				{
					this.remetentes = new Array<SelectItem>();
					this.remetentes.push({ label: 'Todos os registros', value: null });

					result.Items.forEach((item, index, array) => 
					{
						this.remetentes.push({ label: item.RazaoSocial, value: item.Id });
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
		let filtroCliente = new ClienteFilter();
		filtroCliente.AtivoFilter = true;
		filtroCliente.AtivoValue = true;

		//executa consulta
		this.clienteService
			.pegaLista(filtroCliente, 1, 10000)
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
			.pegaLista(filter, 1, 100000)
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

	private processaFiltro(): void
	{
		//data
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

		//tipo
		if(this.filtro.TipoValue == null)
			this.filtro.TipoFilter = false;
		else
			this.filtro.TipoFilter = true;

		//remetente
		if(this.filtro.RemetenteValue)
			this.filtro.RemetenteFilter = true;
		else
			this.filtro.RemetenteFilter = false;

		//cliente
		if(this.filtro.ClienteValue)
			this.filtro.ClienteFilter = true;
		else
			this.filtro.ClienteFilter = false;

		//pedido
		if(this.filtro.PedidoValue)
			this.filtro.PedidoFilter = true;
		else
			this.filtro.PedidoFilter = false;

		
	}

	private carregaLista(): void
	{
		//inicializa o loading
		this.loading.Status = true;

		//verifica status
		this.processaFiltro();

		//executa consulta
		this.remetenteEstoqueService
			.pegaLista(this.filtro, 1, 100000)
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

	public onGerar_Click(): void
	{
		this.carregaLista();
	}
}
