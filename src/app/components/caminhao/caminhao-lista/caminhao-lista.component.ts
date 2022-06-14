import { Component, OnInit } from '@angular/core';
import { ListResult } from 'src/app/helpers/list-result.helper';
import { Caminhao } from 'src/app/models/caminhao.model';
import { CaminhaoFilter } from 'src/app/filters/caminhao.filter';
import { Loading } from 'src/app/helpers/loading.helper';
import { GlobalService } from 'src/app/services/global.service';
import { CaminhaoService } from 'src/app/services/caminhao.service';
import { DialogService } from 'primeng/dynamicdialog';
import { DialogServiceHelper } from 'src/app/services/dialog.service';
import { DialogTypeEnum } from 'src/app/enums/dialog-type.enum';
import { CaminhaoEditaComponent } from '../caminhao-edita/caminhao-edita.component';
import { SelectItem } from 'primeng/api/selectitem';
import { MotoristaService } from 'src/app/services/motorista.service';
import { MotoristaFilter } from 'src/app/filters/motorista.filter';
import { ProprietarioService } from 'src/app/services/proprietario.service';
import { ProprietarioFilter } from 'src/app/filters/proprietario.filter';

@Component({
	selector: 'app-caminhao-lista',
	templateUrl: './caminhao-lista.component.html',
	styleUrls: ['./caminhao-lista.component.css'],
	providers: [ DialogService ]
})
export class CaminhaoListaComponent implements OnInit 
{
	public vm: ListResult<Caminhao> = new ListResult<Caminhao>();
	public filtro: CaminhaoFilter = new CaminhaoFilter();
	public motoristas: SelectItem[];
	public proprietarios: SelectItem[];
	public loading: Loading = new Loading();

	constructor(public globalService: GlobalService,
		private caminhaoService: CaminhaoService,
		private motoristaService: MotoristaService,
		private proprietarioService: ProprietarioService,
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
		this.carregaMotoristas();
		this.carregaProprietarios();
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
				label: 'Listagem de Caminhões'
			}
		];
	}

	private carregaMotoristas(): void
	{
		//inicializa o loading
		this.loading.Status = true;

		//filtro
		let filter = new MotoristaFilter();
		filter.AtivoFilter = true;
		filter.AtivoValue = true;
		
		//executa consulta
		this.motoristaService
			.pegaLista(filter, 1, 10000)
			.then((result) => 
			{
				if(result.IsValid)
				{
					this.motoristas = new Array<SelectItem>();
					this.motoristas.push({ label: 'Todos os registros', value: null });

					result.Items.forEach((item, index, array) => 
					{
						this.motoristas.push({ label: item.Nome + ' - ' + item.Documento1, value: item.Id });
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

	private carregaProprietarios(): void
	{
		//inicializa o loading
		this.loading.Status = true;

		//filtro
		let filter = new ProprietarioFilter();
		filter.AtivoFilter = true;
		filter.AtivoValue = true;
		
		//executa consulta
		this.proprietarioService
			.pegaLista(filter, 1, 10000)
			.then((result) => 
			{
				if(result.IsValid)
				{
					this.proprietarios = new Array<SelectItem>();
					this.proprietarios.push({ label: 'Todos os registros', value: null });

					result.Items.forEach((item, index, array) => 
					{
						this.proprietarios.push({ label: item.Nome + ' - ' + item.Documento, value: item.Id });
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
		if(this.filtro.NomeValue)
			this.filtro.NomeFilter = true;
		else
			this.filtro.NomeFilter = false;
			
		if(this.filtro.MotoristaValue != null)
			this.filtro.MotoristaFilter = true;
		else
			this.filtro.MotoristaFilter = false;

		if(this.filtro.ProprietarioValue != null)
			this.filtro.ProprietarioFilter = true;
		else
			this.filtro.ProprietarioFilter = false;

		if(this.filtro.NomeValue)
			this.filtro.NomeFilter = true;
		else
			this.filtro.NomeFilter = false;

		if(this.filtro.PlacaValue)
			this.filtro.PlacaFilter = true;
		else
			this.filtro.PlacaFilter = false;

		if(this.filtro.CapacidadeValue)
			this.filtro.CapacidadeFilter = true;
		else
			this.filtro.CapacidadeFilter = false;

		if(this.filtro.ModeloValue)
			this.filtro.ModeloFilter = true;
		else
			this.filtro.ModeloFilter = false;

	}


	private carregaLista(): void
	{
		//inicializa o loading
		this.loading.Status = true;

		//configura o filtro
		this.processaFiltro();
		
		//executa consulta
		this.caminhaoService
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

	private deleta(item: Caminhao): void
	{
		this.loading.Status = true;

		this.caminhaoService
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

		const ref = this.modalService.open(CaminhaoEditaComponent, 
		{
			header: title,
			data: data,
			width: '60%'
		});

		ref.onClose.subscribe((result: Caminhao) => 
		{
			if(result != null)
			{
				this.carregaLista();
			}
		});
	}

	private edita(item: Caminhao): void
	{
		let title = 'Editando: ' + item.Placa;
		let data = 
		{
			id: item.Id
		};

		const ref = this.modalService.open(CaminhaoEditaComponent, 
		{
			header: title,
			data: data,
			width: '60%'
		});

		ref.onClose.subscribe((result: Caminhao) => 
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

	public onEdita_Click(item: Caminhao): void
	{
		this.edita(item);
	}

	public onDeleta_Click(item: Caminhao): void
	{
		let title = 'Confirmação de exclusão';
		let message = 'Tem certeza que deseja excluir o registro ' + item.Placa + '?'
		
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
