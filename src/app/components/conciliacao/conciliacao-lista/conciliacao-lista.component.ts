import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { ListResult } from 'src/app/helpers/list-result.helper';
import { Conciliacao } from 'src/app/models/conciliacao.model';
import { ConciliacaoFilter } from 'src/app/filters/conciliacao.filter';
import { SelectItem } from 'primeng/api';
import { Loading } from 'src/app/helpers/loading.helper';
import { GlobalService } from 'src/app/services/global.service';
import { ConciliacaoService } from 'src/app/services/conciliacao.service';
import { ContaBancariaService } from 'src/app/services/conta-bancaria.service';
import { DialogServiceHelper } from 'src/app/services/dialog.service';
import { DialogTypeEnum } from 'src/app/enums/dialog-type.enum';
import { ConciliacaoEditaComponent } from '../conciliacao-edita/conciliacao-edita.component';
import { CommonHelper } from 'src/app/helpers/common.helper';

@Component({
	selector: 'app-conciliacao-lista',
	templateUrl: './conciliacao-lista.component.html',
	styleUrls: ['./conciliacao-lista.component.css'],
	providers: [ DialogService ]
})
export class ConciliacaoListaComponent implements OnInit 
{
	public vm: ListResult<Conciliacao> = new ListResult<Conciliacao>();
	public filtro: ConciliacaoFilter = new ConciliacaoFilter();
	public contas: SelectItem[];
	public filtroData: Date[];
	public loading: Loading = new Loading();
	public localeBR: any;

	constructor(public globalService: GlobalService,
		private conciliacaoService: ConciliacaoService,
		private contaBancariaService: ContaBancariaService,
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
		this.carregaContasBancarias();
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
				label: 'Listagem de Conciliações'
			}
		];
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
					this.contas = new Array<SelectItem>();
					this.contas.push({ label: 'Todos os registros', value: null });

					result.Items.forEach((item, index, array) => 
					{
						this.contas.push({ label: item.Nome, value: item.Id });
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
		if(this.filtro.BancoValue != null)
			this.filtro.BancoFilter = true;
		else
			this.filtro.BancoFilter = false;

		//data emissao
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

	private carregaLista(): void
	{
		//inicializa o loading
		this.loading.Status = true;

		//configura o filtro
		this.processaFiltro();
		
		//executa consulta
		this.conciliacaoService
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

	private deleta(item: Conciliacao): void
	{
		this.loading.Status = true;

		this.conciliacaoService
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

		const ref = this.modalService.open(ConciliacaoEditaComponent, 
		{
			header: title,
			data: data,
			width: '60%'
		});

		ref.onClose.subscribe((result: Conciliacao) => 
		{
			if(result != null)
			{
				this.carregaLista();
			}
		});
	}

	private edita(item: Conciliacao): void
	{
		let title = 'Editando: ' + item.Id;
		let data = 
		{
			id: item.Id
		};

		const ref = this.modalService.open(ConciliacaoEditaComponent, 
		{
			header: title,
			data: data,
			width: '60%'
		});

		ref.onClose.subscribe((result: Conciliacao) => 
		{
			if(result != null)
			{
				this.carregaLista();
			}
		});
	}

	public onAdiciona_Click(): void
	{
		this.adiciona();
	}

	public onEdita_Click(item: Conciliacao): void
	{
		this.edita(item);
	}

	public onDeleta_Click(item: Conciliacao): void
	{
		let title = 'Confirmação de exclusão';
		let message = 'Tem certeza que deseja excluir o registro?';
		
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
