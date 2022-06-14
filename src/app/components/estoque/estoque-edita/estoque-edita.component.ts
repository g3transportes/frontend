import { Component, OnInit, Input } from '@angular/core';
import { RemetenteEstoque } from 'src/app/models/remetente-estoque.model';
import { SelectItem } from 'primeng/api';
import { Loading } from 'src/app/helpers/loading.helper';
import { RemetenteEstoqueService } from 'src/app/services/remetente-estoque.service';
import { RemetenteService } from 'src/app/services/remetente.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { DialogServiceHelper } from 'src/app/services/dialog.service';
import { DialogService, DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CommonHelper } from 'src/app/helpers/common.helper';
import { DialogTypeEnum } from 'src/app/enums/dialog-type.enum';
import { RemetenteFilter } from 'src/app/filters/remetente.filter';
import { PedidoFilter } from 'src/app/filters/pedido.filter';
import { ItemResult } from 'src/app/helpers/item-result.helper';

@Component({
	selector: 'app-estoque-edita',
	templateUrl: './estoque-edita.component.html',
	styleUrls: ['./estoque-edita.component.css']
})
export class EstoqueEditaComponent implements OnInit 
{
	@Input() public id: number;
	@Input() public idPedido: number;
	@Input() public idRemetente: number;
	@Input() public tipo: string;
	public vm: RemetenteEstoque = new RemetenteEstoque();
	public tipos: SelectItem[];
	public remetentes: SelectItem[];
	public pedidos: SelectItem[];
	public loading: Loading = new Loading();
	public localeBR: any;

	constructor(private remetenteEstoqueService: RemetenteEstoqueService,
		private remententeService: RemetenteService,
		private pedidoService: PedidoService, 
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
		this.idPedido = this.config.data.idPedido;
		this.idRemetente = this.config.data.idRemetente;
		this.tipo = this.config.data.tipo;

		//inicializa locale
		this.localeBR = CommonHelper.calendarLocale();
		
		//carrega item
		this.carregaTipos();
		this.carregaRemetentes();
		this.carregaPedidos();
		this.carregaItem();
	}

	private carregaTipos(): void
	{
		this.tipos = new Array<SelectItem>();
		this.tipos.push({ label: 'Nenhum tipos', value: '' });
		this.tipos.push({ label: 'Entrada', value: 'C' });
		this.tipos.push({ label: 'Saída', value: 'D' });
	}

	private carregaRemetentes(): void
	{
		//inicializa o loading
		this.loading.Status = true;

		//filtro
		let filter = new RemetenteFilter();
		filter.AtivoFilter = true;
		filter.AtivoValue = true;
		
		//executa consulta
		this.remententeService
			.pegaLista(filter, 1, 10000)
			.then((result) => 
			{
				if(result.IsValid)
				{
					this.remetentes = new Array<SelectItem>();
					this.remetentes.push({ label: 'Nenhum remetente selecionado', value: 0 });

					result.Items.forEach((item, index, array) => 
					{
						let val = item.RazaoSocial + ' ( ' + item.EstoqueAtual + ' paletes )';
						this.remetentes.push({ label: val, value: item.Id });
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

	private carregaPedidos(): void
	{
		//inicializa o loading
		this.loading.Status = true;

		//filtro
		let filter = new PedidoFilter();
		filter.AtivoFilter = true;
		filter.AtivoValue = true;
		
		//executa consulta
		this.pedidoService
			.pegaLista(filter, 1, 10000)
			.then((result) => 
			{
				if(result.IsValid)
				{
					this.pedidos = new Array<SelectItem>();
					this.pedidos.push({ label: 'Nenhum pedido selecionado', value: null });

					result.Items.forEach((item, index, array) => 
					{
						let nome = 'OS: ' + item.OrdemServico;
						nome += item.CTe ? ' - CTe: ' + item.CTe : ''
						nome += item.NFe ? ' - NFe: ' + item.NFe : '';
						
						this.pedidos.push({ label: nome, value: item.Id });
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

	private carregaItem(): void
	{
		if(this.id != 0)
		{
			this.loading.Status = true

			this.remetenteEstoqueService
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
			this.vm = new RemetenteEstoque();

			if(this.idPedido != null && this.idPedido != undefined)
				this.vm.IdPedido = this.idPedido;

			if(this.idRemetente != null && this.idRemetente != undefined)
				this.vm.IdRemetente = this.idRemetente;

			if(this.tipo != null && this.tipo != undefined)
				this.vm.Tipo = this.tipo;
		}
	}

	private formataDatas(): void
	{
		//resolve probelmas de data
		this.vm.Data = CommonHelper.setDate(this.vm.Data);
	}

	private valida(): boolean
	{
		let isValid = true;
		let errors = new Array<string>();

		if(this.vm.Tipo == '')
		{
			isValid = false;
			errors.push('Informe o tipo de movimentação');
		}
		
		if(this.vm.IdRemetente == 0)
		{
			isValid = false;
			errors.push('Informe o remetente');
		}

		if(this.vm.Quantidade == null)
		{
			isValid = false;
			errors.push('Informe a quantidade');
		}
		else
		{
			if(this.vm.Quantidade <= 0)
			{
				isValid = false;
				errors.push('Quantidade deve ser maior que 0');
			}
		}

		if(!this.vm.Data)
		{
			this.vm.Data = CommonHelper.getToday();
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

			this.remetenteEstoqueService
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
			
			this.remetenteEstoqueService
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
