import { Component, OnInit, Input } from '@angular/core';
import { DialogService, DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Pedido } from 'src/app/models/pedido.model';
import { ItemResult } from 'src/app/helpers/item-result.helper';
import { Loading } from 'src/app/helpers/loading.helper';
import { PedidoService } from 'src/app/services/pedido.service';
import { DialogServiceHelper } from 'src/app/services/dialog.service';
import { DialogTypeEnum } from 'src/app/enums/dialog-type.enum';
import { Caminhao } from 'src/app/models/caminhao.model';
import { Motorista } from 'src/app/models/motorista.model';
import { Proprietario } from 'src/app/models/proprietario.model';
import { CaminhaoService } from 'src/app/services/caminhao.service';
import { MotoristaService } from 'src/app/services/motorista.service';
import { ProprietarioService } from 'src/app/services/proprietario.service';

@Component({
	selector: 'app-report-pedido-detalhe',
	templateUrl: './report-pedido-detalhe.component.html',
	styleUrls: ['./report-pedido-detalhe.component.css'],
	providers: [ DialogService ]
})
export class ReportPedidoDetalheComponent implements OnInit 
{
	@Input() public pedido: Pedido;
	public vm : ItemResult<Pedido> = new ItemResult<Pedido>();
	public caminhao : Caminhao;
	public motorista : Motorista;
	public proprietario : Proprietario;
	public localeBR: any;
	public showReport: boolean = true;
	
	constructor(private pedidoService: PedidoService,
		private caminhaoService: CaminhaoService,
		private motoristaService: MotoristaService,
		private proprietarioService: ProprietarioService,
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
		this.pedido = this.config.data.pedido;
		
		//carrega item
		this.carregaItem();
	}

	private carregaItem(): void
	{
		if(this.pedido != null)
		{
			this.pedidoService
				.pegaItem(this.pedido.Id)
				.then((result) => 
			{
				if(result.IsValid)
				{
					this.vm = result;

					//carrega caminhao
					this.carregaCaminhao();
				}
				else
				{
					this.dialogService.alert('Erro ao carregar os dados', result.Errors, DialogTypeEnum.Erro, () => {
						this.ref.close();
					});
				}
			})
			.catch((error) => 
			{
				this.dialogService.alert('Erro ao carregar os dados', [ error ], DialogTypeEnum.Erro, () => {
					this.ref.close();
				});
			})
		}
		else
		{
			this.ref.close();
		}
	}

	private carregaCaminhao(): void
	{
		if(this.vm.Item.IdCaminhao != null)
		{
			this.caminhaoService
				.pegaItem(this.vm.Item.IdCaminhao)
				.then((result) => 
			{
				if(result.IsValid)
				{
					this.caminhao = result.Item;

					//carrega motorista e proprietario
					this.carregaMotorista();
					this.carregaProprietario();
				}
				else
				{
					this.dialogService.alert('Erro ao carregar os dados', result.Errors, DialogTypeEnum.Erro, () => {
						this.ref.close();
					});
				}
			})
			.catch((error) => 
			{
				this.dialogService.alert('Erro ao carregar os dados', [ error ], DialogTypeEnum.Erro, () => {
					this.ref.close();
				});
			})
		}
	}

	private carregaMotorista(): void
	{
		if(this.caminhao.IdMotorista != null)
		{
			this.motoristaService
				.pegaItem(this.caminhao.IdMotorista)
				.then((result) => 
			{
				if(result.IsValid)
				{
					this.motorista = result.Item;
				}
				else
				{
					this.dialogService.alert('Erro ao carregar os dados', result.Errors, DialogTypeEnum.Erro, () => {
						this.ref.close();
					});
				}
			})
			.catch((error) => 
			{
				this.dialogService.alert('Erro ao carregar os dados', [ error ], DialogTypeEnum.Erro, () => {
					this.ref.close();
				});
			})
		}
	}

	private carregaProprietario(): void
	{
		if(this.caminhao.IdProprietario != null)
		{
			this.proprietarioService
				.pegaItem(this.caminhao.IdProprietario)
				.then((result) => 
			{
				if(result.IsValid)
				{
					this.proprietario = result.Item;
					
				}
				else
				{
					this.dialogService.alert('Erro ao carregar os dados', result.Errors, DialogTypeEnum.Erro, () => {
						this.ref.close();
					});
				}
			})
			.catch((error) => 
			{
				this.dialogService.alert('Erro ao carregar os dados', [ error ], DialogTypeEnum.Erro, () => {
					this.ref.close();
				});
			})
		}
	}
}