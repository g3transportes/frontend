import { Component, OnInit } from '@angular/core';
import { ListResult } from 'src/app/helpers/list-result.helper';
import { Pedido } from 'src/app/models/pedido.model';
import { PedidoFilter } from 'src/app/filters/pedido.filter';
import { SelectItem } from 'primeng/api/selectitem';
import { Loading } from 'src/app/helpers/loading.helper';
import { GlobalService } from 'src/app/services/global.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { CaminhaoService } from 'src/app/services/caminhao.service';
import { DialogService } from 'primeng/dynamicdialog';
import { DialogServiceHelper } from 'src/app/services/dialog.service';
import { ClienteFilter } from 'src/app/filters/cliente.filter';
import { DialogTypeEnum } from 'src/app/enums/dialog-type.enum';
import { CaminhaoFilter } from 'src/app/filters/caminhao.filter';
import { PedidoEditaComponent } from '../pedido-edita/pedido-edita.component';
import { PedidoFinalizaComponent } from '../pedido-finaliza/pedido-finaliza.component';
import { CommonHelper } from 'src/app/helpers/common.helper';
import { FinalizaPedido } from 'src/app/helpers/finaliza-pedido.helper';
import { PedidoEntregaComponent } from '../pedido-entrega/pedido-entrega.component';
import { RemetenteService } from 'src/app/services/remetente.service';
import { RemetenteFilter } from 'src/app/filters/remetente.filter';

@Component({
	selector: 'app-pedido-lista',
	templateUrl: './pedido-lista.component.html',
	styleUrls: ['./pedido-lista.component.css'],
	providers: [ DialogService ]
})
export class PedidoListaComponent implements OnInit 
{
	public vm: ListResult<Pedido> = new ListResult<Pedido>();
	public filtro: PedidoFilter = new PedidoFilter();
	public clientes: SelectItem[];
	public caminhoes: SelectItem[];
	public remetentes: SelectItem[];
	public coletado: SelectItem[];
	public filtroDataEmissao: Date[];
	public filtroDataColeta: Date[];
	public filtroDataFinalizado: Date[];
	
	public loading: Loading = new Loading();
	public localeBR: any;

	constructor(public globalService: GlobalService,
		private pedidoService: PedidoService,
		private clienteService: ClienteService,
		private remetenteService: RemetenteService,
		private caminhaoService: CaminhaoService,
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
		this.carregaStatus();
		this.carregaClientes();
		this.carregaRemetentes();
		this.carregaCaminhoes();
		this.carregaLista();
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
				label: 'Listagem de Pedidos'
			}
		];
	}

	private carregaStatus(): void
	{
		this.coletado = new Array<SelectItem>();

		this.coletado.push({ label: 'Todos', value: null });
		this.coletado.push({ label: 'Não', value: false });
		this.coletado.push({ label: 'Sim', value: true });
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

	private processaFiltro(): void
	{
		if(this.filtro.CaminhaoValue)
			this.filtro.CaminhaoFilter = true;
		else
			this.filtro.CaminhaoFilter = false;
			
		if(this.filtro.ClienteValue != null)
			this.filtro.ClienteFilter = true;
		else
			this.filtro.ClienteFilter = false;

		if(this.filtro.RemetenteValue != null)
			this.filtro.RemetenteFilter = true;
		else
			this.filtro.RemetenteFilter = false;

		if(this.filtro.OrdemServicoValue)
			this.filtro.OrdemServicoFilter = true;
		else
			this.filtro.OrdemServicoFilter = false;

		if(this.filtro.NumPedidoValue)
			this.filtro.NumPedidoFilter = true;
		else
			this.filtro.NumPedidoFilter = false;

		//data emissao
		if(this.filtroDataEmissao != null  && this.filtroDataEmissao != undefined)
		{
			this.filtro.DataEmissaoFilter = true;
			this.filtro.DataEmissaoMinValue = this.filtroDataEmissao[0];
			if(this.filtroDataEmissao[1] != null && this.filtroDataEmissao[1] != undefined)
				this.filtro.DataEmissaoMaxValue = this.filtroDataEmissao[1];
			else
				this.filtro.DataEmissaoMaxValue = this.filtro.DataEmissaoMinValue;
		}
		else
		{
			this.filtro.DataEmissaoFilter = false;
			this.filtro.DataEmissaoMinValue = null;
			this.filtro.DataEmissaoMaxValue = null;
		}

		//data coleta
		if(this.filtroDataColeta != null  && this.filtroDataColeta != undefined)
		{
			this.filtro.DataColetaFilter = true;
			this.filtro.DataColetaMinValue = this.filtroDataColeta[0];
			if(this.filtroDataColeta[1] != null && this.filtroDataColeta[1] != undefined)
				this.filtro.DataColetaMaxValue = this.filtroDataColeta[1];
			else
				this.filtro.DataColetaMaxValue = this.filtro.DataColetaMinValue;
		}
		else
		{
			this.filtro.DataColetaFilter = false;
			this.filtro.DataColetaMinValue = null;
			this.filtro.DataColetaMaxValue = null;
		}

		//data finalizado
		if(this.filtroDataFinalizado != null  && this.filtroDataFinalizado != undefined)
		{
			this.filtro.DataFinalizadoFilter = true;
			this.filtro.DataFinalizadoMinValue = this.filtroDataFinalizado[0];
			if(this.filtroDataFinalizado[1] != null && this.filtroDataFinalizado[1] != undefined)
				this.filtro.DataFinalizadoMaxValue = this.filtroDataFinalizado[1];
			else
				this.filtro.DataFinalizadoMaxValue = this.filtro.DataFinalizadoMinValue;
		}
		else
		{
			this.filtro.DataFinalizadoFilter = false;
			this.filtro.DataFinalizadoMinValue = null;
			this.filtro.DataFinalizadoMaxValue = null;
		}

		if(this.filtro.ValorBrutoValue)
			this.filtro.ValorBrutoFilter = true;
		else
			this.filtro.ValorBrutoFilter = false;

		if(this.filtro.ValorLiquidoValue)
			this.filtro.ValorLiquidoFilter = true;
		else
			this.filtro.ValorLiquidoFilter = false;

		if(this.filtro.ValorFreteValue)
			this.filtro.ValorFreteFilter = true;
		else
			this.filtro.ValorFreteFilter = false;

		if(this.filtro.ValorComissaoValue)
			this.filtro.ValorComissaoFilter = true;
		else
			this.filtro.ValorComissaoFilter = false;

		if(this.filtro.DescricaoValue)
			this.filtro.DescricaoFilter = true;
		else
			this.filtro.DescricaoFilter = false;

		if(this.filtro.ColetadoValue == null)
			this.filtro.ColetadoFilter = false;
		else
			this.filtro.ColetadoFilter = true;

		if(this.filtro.EntregueValue == null)
			this.filtro.EntregueFilter = false;
		else
			this.filtro.EntregueFilter = true;
	}

	private carregaLista(): void
	{
		//inicializa o loading
		this.loading.Status = true;

		//configura o filtro
		this.processaFiltro();
		
		//executa consulta
		this.pedidoService
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

	private deleta(item: Pedido): void
	{
		this.loading.Status = true;

		this.pedidoService
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

		const ref = this.modalService.open(PedidoEditaComponent, 
		{
			header: title,
			data: data,
			width: '80%'
		});

		ref.onClose.subscribe((result: Pedido) => 
		{
			if(result != null)
			{
				this.carregaLista();
			}
		});
	}

	private edita(item: Pedido): void
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

		ref.onClose.subscribe((result: Pedido) => 
		{
			if(result != null)
			{
				this.carregaLista();
			}
		});
	}

	private finaliza(item: Pedido): void
	{
		let title = 'Finalizando: ' + item.OrdemServico;
		let data = 
		{
			id: item.Id
		};

		const ref = this.modalService.open(PedidoFinalizaComponent, 
		{
			header: title,
			data: data,
			width: '60%'
		});

		ref.onClose.subscribe((result: Pedido) => 
		{
			if(result != null)
			{
				this.carregaLista();
			}
		});
	}

	private entrega(item: Pedido): void
	{
		let title = 'Entregando: ' + item.OrdemServico;
		let data = 
		{
			id: item.Id
		};

		const ref = this.modalService.open(PedidoEntregaComponent, 
		{
			header: title,
			data: data,
			width: '60%'
		});

		ref.onClose.subscribe((result: Pedido) => 
		{
			if(result != null)
			{
				this.carregaLista();
			}
		});
	}

	private estorna(item: Pedido): void
	{
		this.loading.Status = true;

		this.pedidoService
			.estorna(item)
			.then((result) => 
			{
				if(result.IsValid)
				{
					this.carregaLista();
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

	public onAdiciona_Click(): void
	{
		this.adiciona();
	}

	public onEdita_Click(item: Pedido): void
	{
		this.edita(item);
	}

	public onFinaliza_Click(item: Pedido): void
	{
		this.finaliza(item);
	}

	public onEntrega_Click(item: Pedido): void
	{
		this.entrega(item);
	}

	public onEstorna_Click(item: Pedido): void
	{
		let title = 'Confirmação de estorno';
		let message = 'Tem certeza que deseja estornar a coleta do registro ' + item.OrdemServico + '?Todos os lancamentos financeiros serão excluídos';
		
		this.dialogService.confirm(title, message, () => {
			this.estorna(item);
		}, null);
	}

	public onDeleta_Click(item: Pedido): void
	{
		let title = 'Confirmação de exclusão';
		let message = 'Tem certeza que deseja excluir o registro ' + item.OrdemServico + '?'
		
		this.dialogService.confirm(title, message, () => {
			this.deleta(item)
		}, null);
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
}