import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { Configuracao } from 'src/app/models/configuracao.model';
import { Loading } from 'src/app/helpers/loading.helper';
import { ConfiguracaoService } from 'src/app/services/configuracao.service';
import { DialogServiceHelper } from 'src/app/services/dialog.service';
import { DialogTypeEnum } from 'src/app/enums/dialog-type.enum';
import { GlobalService } from 'src/app/services/global.service';

@Component({
	selector: 'app-configuracao',
	templateUrl: './configuracao.component.html',
	styleUrls: ['./configuracao.component.css'],
	providers: [ DialogService ]
})
export class ConfiguracaoComponent implements OnInit 
{
	public vm: Configuracao = new Configuracao();
	public loading: Loading = new Loading();

	constructor(public globalService: GlobalService,
		private configuracaoService: ConfiguracaoService, 
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
		
		//carrega item
		this.carregaItem();
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
				label: 'Informações da Empresa'
			}
		];
	}

	private carregaItem(): void
	{
		this.loading.Status = true

		this.configuracaoService
			.pega()
			.then((result) => 
		{
			if(result.IsValid)
			{
				this.vm = result.Item;
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

	private valida(): boolean
	{
		let isValid = true;
		let errors = new Array<string>();

		return isValid;
	}

	private atualiza(): void
	{
		if(this.valida())
		{
			this.loading.Status = true;
			
			this.configuracaoService
				.atualiza(this.vm)
				.then((result) => 
				{
					if(result.IsValid)
					{
						this.vm = result.Item;
						
						this.dialogService.alert('Informações do sistema', ['Dados atualizados com sucesso'], DialogTypeEnum.Sucesso, () => 
						{
							
						});
					}
					else
					{
						this.dialogService.alert('Erro ao salvar os dados', result.Errors, DialogTypeEnum.Erro, null);
					}
				})
				.catch((error) => 
				{
					this.dialogService.alert('Erro ao salvar os dados', [error], DialogTypeEnum.Erro, null);
				})
				.finally(() => 
				{
					this.loading.Status = false;
					this.loading.Text = '';
				})
		}
		
	}

	public onSalvar_Click(): void
	{
		this.atualiza();
	}
}
