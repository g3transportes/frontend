import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { Cliente } from 'src/app/models/cliente.model';
import { ListResult } from 'src/app/helpers/list-result.helper';
import { Loading } from 'src/app/helpers/loading.helper';
import { GlobalService } from 'src/app/services/global.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { DialogServiceHelper } from 'src/app/services/dialog.service';
import { ClienteFilter } from 'src/app/filters/cliente.filter';
import { DialogTypeEnum } from 'src/app/enums/dialog-type.enum';
import { UsuarioEditaComponent } from '../../usuario/usuario-edita/usuario-edita.component';
import { ClienteEditaComponent } from '../cliente-edita/cliente-edita.component';

@Component({
	selector: 'app-cliente-lista',
	templateUrl: './cliente-lista.component.html',
	styleUrls: ['./cliente-lista.component.css'],
	providers: [ DialogService ]
})
export class ClienteListaComponent implements OnInit 
{
	public vm: ListResult<Cliente> = new ListResult<Cliente>();
	public filtro: ClienteFilter = new ClienteFilter();
	public loading: Loading = new Loading();

	constructor(public globalService: GlobalService,
		private clienteService: ClienteService,
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
				label: 'Listagem de Clientes'
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
		this.clienteService
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

	private deleta(item: Cliente): void
	{
		this.loading.Status = true;

		this.clienteService
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

		const ref = this.modalService.open(ClienteEditaComponent, 
		{
			header: title,
			data: data,
			width: '60%'
		});

		ref.onClose.subscribe((result: Cliente) => 
		{
			if(result != null)
			{
				this.carregaLista();
			}
		});
	}

	private edita(item: Cliente): void
	{
		let title = 'Editando: ' + item.NomeFantasia;
		let data = 
		{
			id: item.Id
		};

		const ref = this.modalService.open(ClienteEditaComponent, 
		{
			header: title,
			data: data,
			width: '60%'
		});

		ref.onClose.subscribe((result: Cliente) => 
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

	public onEdita_Click(item: Cliente): void
	{
		this.edita(item);
	}

	public onDeleta_Click(item: Cliente): void
	{
		let title = 'Confirmação de exclusão';
		let message = 'Tem certeza que deseja excluir o registro ' + item.NomeFantasia + '?'
		
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
