import { Component, OnInit, Input } from '@angular/core';
import { RemetenteFilter } from 'src/app/filters/remetente.filter';
import { ListResult } from 'src/app/helpers/list-result.helper';
import { Remetente } from 'src/app/models/remetente.model';
import { SelectItem } from 'primeng/api';
import { Loading } from 'src/app/helpers/loading.helper';
import { GlobalService } from 'src/app/services/global.service';
import { RemetenteService } from 'src/app/services/remetente.service';
import { DialogService } from 'primeng/dynamicdialog';
import { DialogServiceHelper } from 'src/app/services/dialog.service';
import { CommonHelper } from 'src/app/helpers/common.helper';
import { DialogTypeEnum } from 'src/app/enums/dialog-type.enum';

@Component({
	selector: 'app-report-estoque-lista',
	templateUrl: './report-estoque-lista.component.html',
	styleUrls: ['./report-estoque-lista.component.css'],
	providers: [ DialogService ]
})
export class ReportEstoqueListaComponent implements OnInit 
{
	@Input() public filtro: RemetenteFilter;
	public vm : Array<Remetente> = new Array<Remetente>();
	public remetentes: SelectItem[];
	public loading: Loading = new Loading();
	public localeBR: any;
	public showReport: boolean = false;

	constructor(public globalService: GlobalService,
		private remetenteService: RemetenteService,
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
			this.filtro = new RemetenteFilter();
			this.filtro.AtivoFilter = true;
			this.filtro.AtivoValue = true;
		}
			

		this.carregaBreadcrumb();
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
				label: 'Listagem de Estoque'
			}
		];
	}

	private carregaRemetentes(): void
	{
		//inicializa o loading
		this.loading.Status = true;

		//filtro
		let filtroRemetente = new RemetenteFilter();
		filtroRemetente.AtivoFilter = true;
		filtroRemetente.AtivoValue = true;

		//executa consulta
		this.remetenteService
			.pegaLista(filtroRemetente, 1, 10000)
			.then((result) => 
			{
				if(result.IsValid)
				{
					this.remetentes = new Array<SelectItem>();
					
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

	private processaFiltro(): void
	{
		if(this.filtro.CodigoValue != null)
		{
			if(this.filtro.CodigoValue.length > 0)
				this.filtro.CodigoFilter = true;
			else
				this.filtro.CodigoFilter = false;
		}
		else
		{
			this.filtro.CodigoFilter = false;
		}
	}

	private carregaLista(): void
	{
		//inicializa o loading
		this.loading.Status = true;

		//verifica status
		this.processaFiltro();

		//executa consulta
		this.remetenteService
			.pegaLista(this.filtro, 1, 100000)
			.then((result) => 
			{
				if(result.IsValid)
				{
					//inicializa o view model
					this.vm = new Array<Remetente>();

					//carrega o view model
					result.Items.forEach((value, index, array) => 
					{
						if(value.EstoqueAtual != 0)
						{
							this.vm.push(value);
						}
					})

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

	public calculaSaldo(): number
	{
		let result = this.vm.map(a => a.EstoqueAtual).reduce((a, b) => a + b);

		return result;
	}

	public onGerar_Click(): void
	{
		this.carregaLista();
	}
}
