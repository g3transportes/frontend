import { Component, OnInit, Input } from '@angular/core';
import { DialogService, DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Pedido } from 'src/app/models/pedido.model';
import { Loading } from 'src/app/helpers/loading.helper';
import { PedidoService } from 'src/app/services/pedido.service';
import { DialogServiceHelper } from 'src/app/services/dialog.service';
import { CommonHelper } from 'src/app/helpers/common.helper';
import { DialogTypeEnum } from 'src/app/enums/dialog-type.enum';

@Component({
	selector: 'app-pedido-entrega',
	templateUrl: './pedido-entrega.component.html',
	styleUrls: ['./pedido-entrega.component.css'],
	providers: [ DialogService ]
})
export class PedidoEntregaComponent implements OnInit 
{
	@Input() public id: number;
	public vm: Pedido = new Pedido();
	public loading: Loading = new Loading();
	public localeBR: any;

	constructor(private pedidoService: PedidoService, 
		private dialogService: DialogServiceHelper, 
		private modalService: DialogService,
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

		//inicializa locale
		this.localeBR = CommonHelper.calendarLocale();
		
		//carrega item
		this.carregaItem();
	}

	private formataDatas(): void
	{
		//resolve probelmas de data
		this.vm.DataCriacao = CommonHelper.setDate(this.vm.DataCriacao);
		
		if(this.vm.DataColeta)
			this.vm.DataColeta = CommonHelper.setDate(this.vm.DataColeta);

		if(this.vm.DataEntrega)
			this.vm.DataEntrega = CommonHelper.setDate(this.vm.DataEntrega);

		if(this.vm.DataPagamento)
			this.vm.DataPagamento = CommonHelper.setDate(this.vm.DataPagamento);

		if(this.vm.DataFinalizado)
			this.vm.DataFinalizado = CommonHelper.setDate(this.vm.DataFinalizado);
	}

	private carregaItem(): void
	{
		if(this.id != 0)
		{
			this.loading.Status = true

			this.pedidoService
				.pegaItem(this.id)
				.then((result) => 
			{
				if(result.IsValid)
				{
					this.vm = result.Item;
					this.vm.DataEntrega = CommonHelper.getToday();
					this.vm.Entregue = true;

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
			this.dialogService.alert('Erro ao carregar os dados', [ 'Nenhum pedido informado' ], DialogTypeEnum.Erro, () => 
			{
				this.ref.close();
			});
		}
	}

	private valida(): boolean
	{
		let isValid = true;
		let errors = new Array<string>();

		if(!this.vm.DataEntrega)
		{
			isValid = false;
			errors.push('Informe a data da entrega');
		}

		if(isValid == false)
		{
			this.dialogService.alert('Erro ao validar o formulário', errors, DialogTypeEnum.Warning , null);
		}

		return isValid;
	}

	private entrega(): void
	{
		if(this.valida())
		{
			this.loading.Status = true;

			this.pedidoService
				.entrega(this.vm)
				.then((result) => 
				{
					if(result.IsValid)
					{
						this.dialogService.alert('Informações do sistema', ['Pedido entregue com sucesso'], DialogTypeEnum.Sucesso, () => 
						{
							this.ref.close(result.Item);
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

	public onSalvar_Click(): void
	{
		this.entrega();
	}
}
