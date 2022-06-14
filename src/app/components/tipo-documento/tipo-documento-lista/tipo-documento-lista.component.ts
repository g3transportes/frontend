import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { ListResult } from 'src/app/helpers/list-result.helper';
import { TipoDocumento } from 'src/app/models/tipo-documento.model';
import { Loading } from 'src/app/helpers/loading.helper';
import { GlobalService } from 'src/app/services/global.service';
import { TipoDocumentoService } from 'src/app/services/tipo-documento.service';
import { DialogServiceHelper } from 'src/app/services/dialog.service';
import { DialogTypeEnum } from 'src/app/enums/dialog-type.enum';
import { TipoDocumentoEditaComponent } from '../tipo-documento-edita/tipo-documento-edita.component';

@Component({
	selector: 'app-tipo-documento-lista',
	templateUrl: './tipo-documento-lista.component.html',
	styleUrls: ['./tipo-documento-lista.component.css'],
	providers: [ DialogService ]
})
export class TipoDocumentoListaComponent implements OnInit 
{
	public vm: ListResult<TipoDocumento> = new ListResult<TipoDocumento>();
	public loading: Loading = new Loading();

	constructor(public globalService: GlobalService,
		private tipoDocumentoService: TipoDocumentoService,
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
				label: 'Tipos de Documento'
			}
		];
	}

	private carregaLista(): void
	{
		//inicializa o loading
		this.loading.Status = true;
		
		//executa consulta
		this.tipoDocumentoService
			.pegaLista()
			.then((result) => 
			{
				if(result.IsValid)
				{
					this.vm = result;
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

	private deleta(item: TipoDocumento): void
	{
		this.loading.Status = true;

		this.tipoDocumentoService
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

		const ref = this.modalService.open(TipoDocumentoEditaComponent, 
		{
			header: title,
			data: data,
			width: '50%'
		});

		ref.onClose.subscribe((result: TipoDocumento) => 
		{
			if(result != null)
			{
				this.carregaLista();
			}
		});
	}

	private edita(item: TipoDocumento): void
	{
		let title = 'Editando: ' + item.Nome;
		let data = 
		{
			id: item.Id
		};

		const ref = this.modalService.open(TipoDocumentoEditaComponent, 
		{
			header: title,
			data: data,
			width: '50%'
		});

		ref.onClose.subscribe((result: TipoDocumento) => 
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

	public onEdita_Click(item: TipoDocumento): void
	{
		this.edita(item);
	}

	public onDeleta_Click(item: TipoDocumento): void
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
