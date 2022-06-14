import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { ListResult } from 'src/app/helpers/list-result.helper';
import { Motorista } from 'src/app/models/motorista.model';
import { MotoristaFilter } from 'src/app/filters/motorista.filter';
import { Loading } from 'src/app/helpers/loading.helper';
import { GlobalService } from 'src/app/services/global.service';
import { MotoristaService } from 'src/app/services/motorista.service';
import { DialogServiceHelper } from 'src/app/services/dialog.service';
import { DialogTypeEnum } from 'src/app/enums/dialog-type.enum';
import { MotoristaEditaComponent } from '../motorista-edita/motorista-edita.component';

@Component({
	selector: 'app-motorista-lista',
	templateUrl: './motorista-lista.component.html',
	styleUrls: ['./motorista-lista.component.css'],
	providers: [ DialogService ]
})
export class MotoristaListaComponent implements OnInit 
{
	public vm: ListResult<Motorista> = new ListResult<Motorista>();
	public filtro: MotoristaFilter = new MotoristaFilter();
	public loading: Loading = new Loading();

	constructor(public globalService: GlobalService,
		private motoristaService: MotoristaService,
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
		this.carregaBreadcrumb();
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
				label: 'Listagem de Motoristas'
			}
		];
	}

	private processaFiltro(): void
	{
		if(this.filtro.NomeValue)
			this.filtro.NomeFilter = true;
		else
			this.filtro.NomeFilter = false;
			
		if(this.filtro.DocumentoValue)
			this.filtro.DocumentoFilter = true;
		else
			this.filtro.DocumentoFilter = false;

		if(this.filtro.DescricaoValue)
			this.filtro.DescricaoFilter = true;
		else
			this.filtro.DescricaoFilter = false;

	}


	private carregaLista(): void
	{
		//inicializa o loading
		this.loading.Status = true;

		//configura o filtro
		this.processaFiltro();
		
		//executa consulta
		this.motoristaService
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

	private deleta(item: Motorista): void
	{
		this.loading.Status = true;

		this.motoristaService
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

		const ref = this.modalService.open(MotoristaEditaComponent, 
		{
			header: title,
			data: data,
			width: '60%'
		});

		ref.onClose.subscribe((result: Motorista) => 
		{
			if(result != null)
			{
				this.carregaLista();
			}
		});
	}

	private edita(item: Motorista): void
	{
		let title = 'Editando: ' + item.Nome;
		let data = 
		{
			id: item.Id
		};

		const ref = this.modalService.open(MotoristaEditaComponent, 
		{
			header: title,
			data: data,
			width: '60%'
		});

		ref.onClose.subscribe((result: Motorista) => 
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

	public onEdita_Click(item: Motorista): void
	{
		this.edita(item);
	}

	public onDeleta_Click(item: Motorista): void
	{
		let title = 'Confirmação de exclusão';
		let message = 'Tem certeza que deseja excluir o registro ' + item.Nome + '?'
		
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
