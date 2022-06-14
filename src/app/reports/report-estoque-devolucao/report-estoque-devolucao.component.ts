import { Component, OnInit, Input } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { RemetenteEstoqueFilter } from 'src/app/filters/remetente-estoque.filter';
import { ItemResult } from 'src/app/helpers/item-result.helper';
import { Estoque } from 'src/app/viewmodels/estoque.model';
import { PedidoFilter } from 'src/app/filters/pedido.filter';
import { Pedido } from 'src/app/models/pedido.model';
import { Loading } from 'src/app/helpers/loading.helper';
import { SelectItem } from 'primeng/api';
import { GlobalService } from 'src/app/services/global.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { RemetenteService } from 'src/app/services/remetente.service';
import { DialogServiceHelper } from 'src/app/services/dialog.service';
import { CommonHelper } from 'src/app/helpers/common.helper';
import { ClienteFilter } from 'src/app/filters/cliente.filter';
import { DialogTypeEnum } from 'src/app/enums/dialog-type.enum';
import { RemetenteFilter } from 'src/app/filters/remetente.filter';
import { ListResult } from 'src/app/helpers/list-result.helper';
import { RemetenteEstoque } from 'src/app/models/remetente-estoque.model';
import { Remetente } from 'src/app/models/remetente.model';
import { Cliente } from 'src/app/models/cliente.model';
import { EstoqueEditaComponent } from 'src/app/components/estoque/estoque-edita/estoque-edita.component';

@Component({
	selector: 'app-report-estoque-devolucao',
	templateUrl: './report-estoque-devolucao.component.html',
	styleUrls: ['./report-estoque-devolucao.component.css'],
	providers: [ DialogService ]
})
export class ReportEstoqueDevolucaoComponent implements OnInit 
{
	@Input() public filtro: PedidoFilter;
	public pedidos : ListResult<Pedido> = new ListResult<Pedido>();
	public grupos: Array<Cliente> = new Array<Cliente>();
	public status: SelectItem[];
	public statusColeta: SelectItem[];
	public clientes: SelectItem[];
	public loading: Loading = new Loading();
	public localeBR: any;
	public showReport: boolean = false;
	
	constructor(public globalService: GlobalService,
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
			this.filtro = new PedidoFilter();
			this.filtro.DevolvidoValue = false;
			this.filtro.ColetadoValue = true;
		}
			

		this.carregaBreadcrumb();
		this.carregaStatus();
		this.carregaStatusColeta();
		this.carregaClientes();
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
				label: 'Devolução de pedidos'
			}
		];
	}

	private carregaStatus(): void
	{
		this.status = new Array<SelectItem>();
		this.status.push({ label: 'Todos os pedidos', value: null });
		this.status.push({ label: 'Devolvidos', value: true });
		this.status.push({ label: 'Não devolvidos', value: false });
	}

	private carregaStatusColeta(): void
	{
		this.statusColeta = new Array<SelectItem>();
		this.statusColeta.push({ label: 'Todos os pedidos', value: null });
		this.statusColeta.push({ label: 'Somente coletados', value: true });
		this.statusColeta.push({ label: 'Somente não devolvidos', value: false });
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

	private processaFiltro(): void
	{
		if(this.filtro.ClienteValue != null)
			this.filtro.ClienteFilter = true;
		else
			this.filtro.ClienteFilter = false;
		
		//data coleta
		if(this.filtro.DataColetaMinValue == undefined)
			this.filtro.DataColetaMinValue = null;
		
		if(this.filtro.DataColetaMaxValue == undefined)
			this.filtro.DataColetaMaxValue = null;
		
		if(this.filtro.DataColetaMinValue != null || this.filtro.DataColetaMaxValue != null)
		{
			this.filtro.DataColetaFilter = true;
		}
		else
		{
			this.filtro.DataColetaFilter = false;
		}

		//data devolucao
		if(this.filtro.DataDevolucaoMinValue == undefined)
			this.filtro.DataDevolucaoMinValue = null;
		
		if(this.filtro.DataDevolucaoMaxValue == undefined)
			this.filtro.DataDevolucaoMaxValue = null;
		
		if(this.filtro.DataDevolucaoMinValue != null || this.filtro.DataDevolucaoMaxValue != null)
		{
			this.filtro.DataDevolucaoFilter = true;
		}
		else
		{
			this.filtro.DataDevolucaoFilter = false;
		}

		//devolvido
		if(this.filtro.DevolvidoValue != null)
			this.filtro.DevolvidoFilter = true;
		else
			this.filtro.DevolvidoFilter = false;

		//coletado
		if(this.filtro.ColetadoValue != null)
			this.filtro.ColetadoFilter = true;
		else
			this.filtro.ColetadoFilter = false;
	}

	private carregaPedidos(): void
	{
		//inicializa o loading
		this.loading.Status = true;

		//verifica status
		this.processaFiltro();

		//executa consulta
		this.pedidoService
			.pegaLista(this.filtro, 1, 100000)
			.then((result) => 
			{
				if(result.IsValid)
				{
					this.pedidos = result;
					this.carregaGrupos();
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

	private carregaGrupos(): void 
	{
		//faz o agrupamento
		let clientes = this.pedidos.Items.map(a => a.Cliente);
		
		//faz grupos
		this.grupos = new Array<Cliente>();

		clientes.forEach((value, index, array) => 
		{
			let existe = this.grupos.findIndex(a => a.Id == value.Id);

			if(existe == -1)
				this.grupos.push(value);
		});
	}

	private adicionaMovimentacao(pedido: Pedido): void
	{
		let title = 'Novo Registro';
		let data = 
		{
			id: 0,
			idPedido: pedido.Id,
			idRemetente: pedido.IdRemetente,
			tipo: 'C'
		};

		const ref = this.modalService.open(EstoqueEditaComponent, 
		{
			header: title,
			data: data,
			width: '60%'
		});

		ref.onClose.subscribe((result: RemetenteEstoque) => 
		{
			if(result != null)
			{
				this.carregaPedidos();
			}
		});
	}

	public pegaLista(cliente: Cliente): Array<Pedido>
	{
		let lista = this.pedidos.Items.filter(a => a.IdCliente == cliente.Id);

		console.log(lista);

		return lista;
	}

	public pegaTotalPeletes(cliente: Cliente): number
	{
		let result = this.pedidos.Items.filter(a => a.IdCliente == cliente.Id)
									   .map(a => a.Paletes)
									   .reduce((a, b) => a + b);

		console.log(result);

		return result;
	}

	public pegaTotalDevolvidos(cliente: Cliente): number
	{
		let result = this.pedidos.Items.filter(a => a.IdCliente == cliente.Id)
									   .map(a => a.PaletesDevolvidos)
									   .reduce((a, b) => a + b);

		return result;
	}

	public pegaTotalPendencia(cliente: Cliente): number
	{
		let paletes = this.pegaTotalPeletes(cliente);
		let devolvidos = this.pegaTotalDevolvidos(cliente);
		let result = paletes - devolvidos;

		return result;
	}

	public onGerar_Click(): void
	{
		this.carregaPedidos();
	}

	public onAdicionaMovimentacao(pedido: Pedido): void
	{
		this.adicionaMovimentacao(pedido);
	}
}
