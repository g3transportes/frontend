import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { ListResult } from 'src/app/helpers/list-result.helper';
import { Usuario } from 'src/app/models/usuario.model';
import { Loading } from 'src/app/helpers/loading.helper';
import { DialogService } from 'primeng/dynamicdialog';
import { UsuarioService } from 'src/app/services/usuario.service';
import { DialogServiceHelper } from 'src/app/services/dialog.service';
import { UsuarioFilter } from 'src/app/filters/usuario.filter';
import { DialogTypeEnum } from 'src/app/enums/dialog-type.enum';
import { UsuarioEditaComponent } from '../usuario-edita/usuario-edita.component';
import { UsuarioEditaSenhaComponent } from '../usuario-edita-senha/usuario-edita-senha.component';

@Component({
	selector: 'app-usuario-lista',
	templateUrl: './usuario-lista.component.html',
	styleUrls: ['./usuario-lista.component.css'],
	providers: [ DialogService ]
})
export class UsuarioListaComponent implements OnInit 
{
	public vm: ListResult<Usuario> = new ListResult<Usuario>();
	public loading: Loading = new Loading();

	constructor(public globalService: GlobalService,
		private usuarioService: UsuarioService,
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
				label: 'Configuração'
			},
			{
				label: 'Listagem de Usuários'
			}
		];
	}

	private carregaLista(): void
	{
		//inicializa o filtro
		let filtro = new UsuarioFilter();

		//inicializa o loading
		this.loading.Status = true;
		
		//executa consulta
		this.usuarioService
			.pegaLista(filtro, this.vm.CurrentPage, this.vm.PageSize)
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

	private deleta(item: Usuario): void
	{
		this.loading.Status = true;

		this.usuarioService
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

		const ref = this.modalService.open(UsuarioEditaComponent, 
		{
			header: title,
			data: data,
			width: '50%'
		});

		ref.onClose.subscribe((result: Usuario) => 
		{
			if(result != null)
			{
				this.carregaLista();
			}
		});
	}

	private edita(item: Usuario): void
	{
		let title = 'Editando: ' + item.Nome;
		let data = 
		{
			id: item.Id
		};

		const ref = this.modalService.open(UsuarioEditaComponent, 
		{
			header: title,
			data: data,
			width: '50%'
		});

		ref.onClose.subscribe((result: Usuario) => 
		{
			if(result != null)
			{
				this.carregaLista();
			}
		});
	}

	private editaSenha(item: Usuario): void
	{
		let title = 'Editando Senha: ' + item.Nome;
		let data = 
		{
			id: item.Id
		};

		const ref = this.modalService.open(UsuarioEditaSenhaComponent, 
		{
			header: title,
			data: data,
			width: '50%'
		});

		ref.onClose.subscribe((result: Usuario) => 
		{
		});
	}

	public onAdiciona_Click(): void
	{
		this.adiciona();
	}

	public onEdita_Click(item: Usuario): void
	{
		this.edita(item);
	}

	public onEditaSenha_Click(item: Usuario): void
	{
		this.editaSenha(item);
	}

	public onDeleta_Click(item: Usuario): void
	{
		let title = 'Confirmação de exclusão';
		let message = 'Tem certeza que deseja excluir o registro ' + item.Nome + '?'
		
		this.dialogService.confirm(title, message, () => {
			this.deleta(item)
		}, null);
	}

	public onPage_Change(event: any): void
	{
		this.vm.CurrentPage = event.page + 1;
		this.carregaLista();
	}

}
