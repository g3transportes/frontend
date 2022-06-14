import { Component, OnInit, Input } from '@angular/core';
import { DialogService, DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ContaBancaria } from 'src/app/models/conta-bancaria.model';
import { Loading } from 'src/app/helpers/loading.helper';
import { ContaBancariaService } from 'src/app/services/conta-bancaria.service';
import { DialogServiceHelper } from 'src/app/services/dialog.service';
import { DialogTypeEnum } from 'src/app/enums/dialog-type.enum';

@Component({
	selector: 'app-conta-bancaria-edita',
	templateUrl: './conta-bancaria-edita.component.html',
	styleUrls: ['./conta-bancaria-edita.component.css'],
	providers: [ DialogService ]
})
export class ContaBancariaEditaComponent implements OnInit 
{
	@Input() public id: number;
	public vm: ContaBancaria = new ContaBancaria();
	public loading: Loading = new Loading();

	constructor(private contaBancariaService: ContaBancariaService, 
		private dialogService: DialogServiceHelper, 
		private ref: DynamicDialogRef, 
		private config: DynamicDialogConfig) 
	{ 

	}

	ngOnInit() 
	{
		this.inicializa();
	}

	private inicializa(): void
	{
		//verifica id
		this.id = this.config.data.id;
		
		//carrega item
		this.carregaItem();
	}

	private carregaItem(): void
	{
		if(this.id != 0)
		{
			this.loading.Status = true

			this.contaBancariaService
				.pegaItem(this.id)
				.then((result) => 
			{
				if(result.IsValid)
				{
					this.vm = result.Item;
					this.formataDatas();
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
		else
		{
			this.vm = new ContaBancaria();
		}
	}

	private formataDatas(): void
	{
		//resolve probelmas de data
	}

	private valida(): boolean
	{
		let isValid = true;
		let errors = new Array<string>();

		if(!this.vm.Nome)
		{
			isValid = false;
			errors.push('Nome é obrigatório');
		}

		if(isValid == false)
		{
			this.dialogService.alert('Erro ao validar o formulário', errors, DialogTypeEnum.Warning , null);
		}

		return isValid;
	}

	private insere(): void
	{
		if(this.valida())
		{
			this.loading.Status = true;

			this.contaBancariaService
				.insere(this.vm)
				.then((result) => 
				{
					if(result.IsValid)
					{
						this.vm = result.Item;
						this.formataDatas();

						this.dialogService.alert('Informações do sistema', ['Dados incluídos com sucesso'], DialogTypeEnum.Sucesso, () => 
						{
							this.ref.close(this.vm);
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
				})
		}
		
	}

	private atualiza(): void
	{
		if(this.valida())
		{
			this.loading.Status = true;
			
			this.contaBancariaService
				.atualiza(this.vm)
				.then((result) => 
				{
					if(result.IsValid)
					{
						this.vm = result.Item;
						this.formataDatas();
						
						this.dialogService.alert('Informações do sistema', ['Dados atualizados com sucesso'], DialogTypeEnum.Sucesso, () => 
						{
							this.ref.close(this.vm);
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
		if(this.vm.Id == 0)
			this.insere();
		else
			this.atualiza();
	}
}