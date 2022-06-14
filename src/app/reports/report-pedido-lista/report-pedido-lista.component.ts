import { Component, OnInit, Input } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { PedidoFilter } from 'src/app/filters/pedido.filter';
import { ListResult } from 'src/app/helpers/list-result.helper';
import { Pedido } from 'src/app/models/pedido.model';
import { SelectItem } from 'primeng/api/selectitem';
import { Loading } from 'src/app/helpers/loading.helper';
import { GlobalService } from 'src/app/services/global.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { CaminhaoService } from 'src/app/services/caminhao.service';
import { DialogServiceHelper } from 'src/app/services/dialog.service';
import { CommonHelper } from 'src/app/helpers/common.helper';
import { ClienteFilter } from 'src/app/filters/cliente.filter';
import { DialogTypeEnum } from 'src/app/enums/dialog-type.enum';
import { CaminhaoFilter } from 'src/app/filters/caminhao.filter';
import { saveAs } from 'file-saver';
import { RemetenteService } from 'src/app/services/remetente.service';
import { RemetenteFilter } from 'src/app/filters/remetente.filter';

@Component({
	selector: 'app-report-pedido-lista',
	templateUrl: './report-pedido-lista.component.html',
	styleUrls: ['./report-pedido-lista.component.css'],
	providers: [ DialogService ]
})
export class ReportPedidoListaComponent implements OnInit 
{
	@Input() public filtro: PedidoFilter;
	public vm : ListResult<Pedido> = new ListResult<Pedido>();
	public clientes: SelectItem[];
	public caminhoes: SelectItem[];
	public remetentes: SelectItem[];
	public loading: Loading = new Loading();
	public localeBR: any;
	public showReport: boolean = false;
	
	constructor(public globalService: GlobalService,
		private pedidoService: PedidoService,
		private clienteService: ClienteService,
		private caminhaoService: CaminhaoService,
		private remetenteService: RemetenteService,
		private modalService: DialogService,
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
			this.filtro = new PedidoFilter();

		this.carregaBreadcrumb();
		this.carregaClientes();
		this.carregaCaminhoes();
		this.carregaRemetentes();
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
				label: 'Ordens de Serviços'
			}
		];
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

	private carregaRemetentes(): void
	{
		//inicializa o loading
		this.loading.Status = true;

		//filtro
		let filter = new RemetenteFilter();
		filter.AtivoFilter = true;
		filter.AtivoValue = true;
		
		//executa consulta
		this.remetenteService
			.pegaLista(filter, 1, 10000)
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

	private carregaLista(): void
	{
		//inicializa o loading
		this.loading.Status = true;

		//configura o filtro
		this.processaFiltro();
		
		//executa consulta
		this.pedidoService
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

	private exporta(): void
	{
		//inicializa o loading
		this.loading.Status = true;

		//configura o filtro
		this.processaFiltro();
		
		//executa consulta
		this.pedidoService
			.exporta(this.filtro)
			.then((result) => 
			{
				if(result.IsValid)
				{
					saveAs(result.Item);
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
		if(this.filtro.ClienteValue != null)
			this.filtro.ClienteFilter = true;
		else
			this.filtro.ClienteFilter = false;
		
		if(this.filtro.CaminhaoValue)
			this.filtro.CaminhaoFilter = true;
		else
			this.filtro.CaminhaoFilter = false;

		if(this.filtro.RemetenteValue)
			this.filtro.RemetenteFilter = true;
		else
			this.filtro.RemetenteFilter = false;

		
		//data emissao
		if(this.filtro.DataEmissaoMinValue == undefined)
			this.filtro.DataEmissaoMinValue = null;
		
		if(this.filtro.DataEmissaoMaxValue == undefined)
			this.filtro.DataEmissaoMaxValue = null;
		
		if(this.filtro.DataEmissaoMinValue != null || this.filtro.DataEmissaoMaxValue != null)
		{
			this.filtro.DataEmissaoFilter = true;
		}
		else
		{
			this.filtro.DataEmissaoFilter = false;
		}

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

		//data entrega
		if(this.filtro.DataEntregaMinValue == undefined)
			this.filtro.DataEntregaMinValue = null;
		
		if(this.filtro.DataEntregaMaxValue == undefined)
			this.filtro.DataEntregaMaxValue = null;
		
		if(this.filtro.DataEntregaMinValue != null || this.filtro.DataEntregaMaxValue != null)
		{
			this.filtro.DataEntregaFilter = true;
		}
		else
		{
			this.filtro.DataEntregaFilter = false;
		}
	}

	public pegaTotalBruto(): number
	{
		return this.vm.Items.map(a => a.ValorBruto).reduce((a, b) => a + b, 0);
	}

	public pegaTotalFrete(): number
	{
		return this.vm.Items.map(a => a.ValorFrete).reduce((a, b) => a + b, 0);
	}

	public pegaTotalG3(): number
	{
		return this.vm.Items.map(a => a.ValorLiquido).reduce((a, b) => a + b, 0);
	}

	public pegaTotalMargem(): number
	{
		return this.vm.Items.map(a => a.ComissaoMargem).reduce((a, b) => a + b, 0);
	}

	public onGerar_Click(): void
	{
		this.carregaLista();
	}

	public onExporta_Click(): void
	{
		this.exporta();
	}
}
