import { Component, OnInit } from '@angular/core';
import { ListResult } from 'src/app/helpers/list-result.helper';
import { RemetenteEstoque } from 'src/app/models/remetente-estoque.model';
import { RemetenteEstoqueFilter } from 'src/app/filters/remetente-estoque.filter';
import { SelectItem } from 'primeng/api';
import { Loading } from 'src/app/helpers/loading.helper';
import { GlobalService } from 'src/app/services/global.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { RemetenteService } from 'src/app/services/remetente.service';
import { DialogService } from 'primeng/dynamicdialog';
import { DialogServiceHelper } from 'src/app/services/dialog.service';
import { CommonHelper } from 'src/app/helpers/common.helper';
import { PedidoFilter } from 'src/app/filters/pedido.filter';
import { DialogTypeEnum } from 'src/app/enums/dialog-type.enum';
import { RemetenteFilter } from 'src/app/filters/remetente.filter';
import { RemetenteEstoqueService } from 'src/app/services/remetente-estoque.service';
import { EstoqueEditaComponent } from '../estoque-edita/estoque-edita.component';
import { Remetente } from 'src/app/models/remetente.model';
import { Pedido } from 'src/app/models/pedido.model';
import { PedidoEditaComponent } from '../../pedido/pedido-edita/pedido-edita.component';
import { RemetenteEditaComponent } from '../../remetente/remetente-edita/remetente-edita.component';

@Component({
	selector: 'app-estoque-lista',
	templateUrl: './estoque-lista.component.html',
	styleUrls: ['./estoque-lista.component.css']
})
export class EstoqueListaComponent implements OnInit 
{
	public vm: ListResult<RemetenteEstoque> = new ListResult<RemetenteEstoque>();
	public filtro: RemetenteEstoqueFilter = new RemetenteEstoqueFilter();
	public pedidos: SelectItem[];
	public remetentes: SelectItem[];
	public tipos: SelectItem[];
	public filtroData: Date[];
	public loading: Loading = new Loading();
	public localeBR: any;

	constructor(public globalService: GlobalService,
		private remetenteEstoqueService: RemetenteEstoqueService,
		private pedidoService: PedidoService,
		private remetenteService: RemetenteService,
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
		this.carregaPedidos();
		this.carregaRemetentes();
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
				label: 'Movimentações'
			},
			{
				label: 'Estoque'
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
						let val = item.RazaoSocial + ' ( ' + item.EstoqueAtual + ' paletes )';
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

	private carregaLista(): void
	{
		//inicializa o loading
		this.loading.Status = true;

		//configura o filtro
		this.processaFiltro();
		
		//executa consulta
		this.remetenteEstoqueService
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

		//pedido
		if(this.filtro.PedidoValue)
			this.filtro.PedidoFilter = true;
		else
			this.filtro.PedidoFilter = false;

		//data
		if(this.filtroData != null  && this.filtroData != undefined)
		{
			this.filtro.DataFilter = true;
			this.filtro.DataMinValue = this.filtroData[0];
			if(this.filtroData[1] != null && this.filtroData[1] != undefined)
				this.filtro.DataMaxValue = this.filtroData[1];
			else
				this.filtro.DataMaxValue = this.filtro.DataMinValue;
		}
		else
		{
			this.filtro.DataFilter = false;
			this.filtro.DataMinValue = null;
			this.filtro.DataMaxValue = null;
		}
	}

	private deleta(item: RemetenteEstoque): void
	{
		this.loading.Status = true;

		this.remetenteEstoqueService
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
				this.carregaLista();
			}
		});
	}

	private edita(item: RemetenteEstoque): void
	{
		let title = 'Editando: ' + item.Id;
		let data = 
		{
			id: item.Id
		};

		const ref = this.modalService.open(EstoqueEditaComponent, 
		{
			header: title,
			data: data,
			width: '60%'
		});

		ref.onClose.subscribe((result: RemetenteEstoque) => 
		{
			this.carregaLista();
		});
	}

	private editaPedido(item: Pedido): void
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

	private editaRemetente(item: Remetente): void
	{
		let title = 'Editando: ' + item.NomeFantasia;
		let data = 
		{
			id: item.Id
		};

		const ref = this.modalService.open(RemetenteEditaComponent, 
		{
			header: title,
			data: data,
			width: '60%'
		});
	}

	public onAdiciona_Click(): void
	{
		this.adiciona();
	}

	public onEdita_Click(item: RemetenteEstoque): void
	{
		this.edita(item);
	}

	public onDeleta_Click(item: RemetenteEstoque): void
	{
		let title = 'Confirmação de exclusão';
		let message = 'Tem certeza que deseja excluir o registro ' + item.Id + '?'
		
		this.dialogService.confirm(title, message, () => {
			this.deleta(item)
		}, null);
	}

	public onFilter_Click(): void
	{
		this.vm.CurrentPage = 1;
		this.carregaLista();
	}

	public onRemetenteEdita_Click(item: Remetente): void
	{
		this.editaRemetente(item);
	}

	public onPedidoEdita_Click(item: Pedido): void
	{
		this.editaPedido(item);
	}

	public onPage_Change(event: any): void
	{
		this.vm.CurrentPage = event.page + 1;
		this.carregaLista();
	}
}
