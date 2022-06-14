import { Component, OnInit, Input } from '@angular/core';
import { Pedido } from 'src/app/models/pedido.model';
import { ListResult } from 'src/app/helpers/list-result.helper';
import { Anexo } from 'src/app/models/anexo.model';
import { SelectItem } from 'primeng/api/selectitem';
import { Loading } from 'src/app/helpers/loading.helper';
import { CommonHelper } from 'src/app/helpers/common.helper';
import { PedidoService } from 'src/app/services/pedido.service';
import { PedidoAnexoService } from 'src/app/services/pedido-anexo.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { CaminhaoService } from 'src/app/services/caminhao.service';
import { DialogServiceHelper } from 'src/app/services/dialog.service';
import { DialogService, DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ClienteFilter } from 'src/app/filters/cliente.filter';
import { DialogTypeEnum } from 'src/app/enums/dialog-type.enum';
import { CaminhaoFilter } from 'src/app/filters/caminhao.filter';
import { ClienteEditaComponent } from '../../cliente/cliente-edita/cliente-edita.component';
import { Cliente } from 'src/app/models/cliente.model';
import { CaminhaoEditaComponent } from '../../caminhao/caminhao-edita/caminhao-edita.component';
import { Caminhao } from 'src/app/models/caminhao.model';
import { PedidoAnexoFilter } from 'src/app/filters/pedido-anexo.filter';
import { AnexoUploadComponent } from '../../anexo/anexo-upload/anexo-upload.component';
import { PedidoAnexo } from 'src/app/models/pedido-anexo.model';
import { RemetenteService } from 'src/app/services/remetente.service';
import { RemetenteFilter } from 'src/app/filters/remetente.filter';
import { RemetenteEditaComponent } from '../../remetente/remetente-edita/remetente-edita.component';
import { Remetente } from 'src/app/models/remetente.model';
import { EstoqueEditaComponent } from '../../estoque/estoque-edita/estoque-edita.component';
import { RemetenteEstoque } from 'src/app/models/remetente-estoque.model';

@Component({
	selector: 'app-pedido-edita',
	templateUrl: './pedido-edita.component.html',
	styleUrls: ['./pedido-edita.component.css'],
	providers: [ DialogService ]
})
export class PedidoEditaComponent implements OnInit 
{
	@Input() public id: number;
	public vm: Pedido = new Pedido();
	public anexos: ListResult<Anexo> = new ListResult<Anexo>();
	public clientesList: ListResult<Cliente> = new ListResult<Cliente>();
	public clientes: SelectItem[];
	public caminhoes: SelectItem[];
	public remetentes: SelectItem[];
	public loading: Loading = new Loading();
	public localeBR: any;

	constructor(private pedidoService: PedidoService, 
		private pedidoAnexoService: PedidoAnexoService,
		private clienteService: ClienteService,
		private caminhaoService: CaminhaoService,
		private remententeService: RemetenteService,
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
		this.carregaClientes();
		this.carregaCaminhoes();
		this.carregaRemetentes();
		this.carregaItem();
	}

	private carregaClientes(): void
	{
		//inicializa o loading
		this.loading.Status = true;

		//filtro
		let filter = new ClienteFilter();
		filter.AtivoFilter = true;
		filter.AtivoValue = true;
		
		//executa consulta
		this.clienteService
			.pegaLista(filter, 1, 10000)
			.then((result) => 
			{
				if(result.IsValid)
				{
					//carrega lista com valores do cliente
					this.clientesList = result;

					//carrega a lista de selecao
					this.clientes = new Array<SelectItem>();
					this.clientes.push({ label: 'Nenhum cliente selecionado', value: 0 });

					result.Items.forEach((item, index, array) => 
					{
						this.clientes.push({ label: item.RazaoSocial, value: item.Id });
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

	private carregaCaminhoes(): void
	{
		//inicializa o loading
		this.loading.Status = true;

		//filtro
		let filter = new CaminhaoFilter();
		filter.AtivoFilter = true;
		filter.AtivoValue = true;
		
		//executa consulta
		this.caminhaoService
			.pegaLista(filter, 1, 10000)
			.then((result) => 
			{
				if(result.IsValid)
				{
					this.caminhoes = new Array<SelectItem>();
					this.caminhoes.push({ label: 'Nenhum veículo selecionado', value: null });

					result.Items.forEach((item, index, array) => 
					{
						let motorista = item.Motorista != null ? item.Motorista.Nome : 'Sem motorista'
						this.caminhoes.push({ label: item.Placa + ' - ' + motorista, value: item.Id });
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
					this.remetentes.push({ label: 'Nenhum remetente selecionado', value: null });

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
				this.carregaAnexos();
			});
		}
		else
		{
			this.vm = new Pedido();
		}
	}

	private formataDatas(): void
	{
		//resolve probelmas de data
		this.vm.DataCriacao = CommonHelper.setDate(this.vm.DataCriacao);
		
		if(this.vm.DataColeta)
			this.vm.DataColeta = CommonHelper.setDate(this.vm.DataColeta);

		if(this.vm.DataFinalizado)
			this.vm.DataFinalizado = CommonHelper.setDate(this.vm.DataFinalizado);
	}

	private valida(): boolean
	{
		let isValid = true;
		let errors = new Array<string>();

		/*
		if(!this.vm.OrdemServico)
		{
			isValid = false;
			errors.push('Informe a ordem de serviço');
		}

		if(this.vm.IdCaminhao == 0)
		{
			isValid = false;
			errors.push('Informe o veículo');
		}
		*/

		if(this.vm.IdCliente == 0)
		{
			isValid = false;
			errors.push('Informe o cliente');
		}

		if(!this.vm.Quantidade)
		{
			this.vm.Quantidade = 0;
		}

		if(!this.vm.ValorLiquido)
		{
			this.vm.ValorLiquido = 0;
		}

		if(!this.vm.ValorFrete)
		{
			this.vm.ValorFrete = 0;
		}

		if(!this.vm.ValorComissao)
		{
			this.vm.ValorComissao = 0;
		}

		this.vm.ValorBruto = this.vm.ValorLiquido;
		this.vm.ValorUnitario = this.vm.Quantidade == 0 ? 0 : this.vm.ValorLiquido / this.vm.Quantidade;

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

			console.log(this.vm.DataCriacao);

			this.pedidoService
				.insere(this.vm)
				.then((result) => 
				{
					if(result.IsValid)
					{
						this.vm = result.Item;
						this.formataDatas();
						this.insereAnexos();

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
			
			this.pedidoService
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

	private adicionaCliente(): void
	{
		let title = 'Novo Cliente';
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
				this.carregaClientes();
				this.vm.IdCliente = result.Id;
			}
		});
	}

	private adicionaCaminhao(): void
	{
		let title = 'Novo Caminhão';
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
				this.carregaCaminhoes();
				this.vm.IdCaminhao = result.Id;
				this.geraOrdemServico();
			}
		});
	}

	private adicionaRemetente(): void
	{
		let title = 'Novo Remetente';
		let data = 
		{
			id: 0
		};

		const ref = this.modalService.open(RemetenteEditaComponent, 
		{
			header: title,
			data: data,
			width: '60%'
		});

		ref.onClose.subscribe((result: Remetente) => 
		{
			if(result != null)
			{
				this.carregaRemetentes();
				this.vm.IdRemetente = result.Id;
			}
		});
	}

	private adicionaEstoque(): void
	{
		let title = 'Novo Registro';
		let data = 
		{
			id: 0
		};

		const ref = this.modalService.open(EstoqueEditaComponent, 
		{
			header: title,
			data: data,
			width: '60%'
		});

		ref.onClose.subscribe((result: RemetenteEstoque) => 
		{
			if(result != null)
			{
				this.carregaRemetentes();
			}
		});
	}

	private geraOrdemServico(): void
	{
		this.loading.Status = true;

		this.pedidoService
			.ordemServico(this.vm)
			.then((result) => 
			{
				if(result.IsValid)
				{
					this.vm.OrdemServico = result.Item;
				}
				else
				{
					this.dialogService.alert('Erro ao gerar ordem de servico', result.Errors, DialogTypeEnum.Erro, null);
				}
			})
			.catch((error) => 
			{
				this.dialogService.alert('Erro ao gerar ordem de servico', [error], DialogTypeEnum.Erro, null);
			})
			.finally(() => 
			{
				this.loading.Status = false;
			})
	}

	
	
	private carregaAnexos(): void
	{
		if(this.vm.Id != 0)
		{
			let filtro = new PedidoAnexoFilter();
			filtro.PedidoFilter = true;
			filtro.PedidoValue = this.vm.Id;

			this.loading.Status = true

			this.pedidoAnexoService
				.pegaLista(filtro, 1, 1000)
				.then((result) => 
			{
				if(result.IsValid)
				{
					this.vm.Anexos = result.Items;
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
	}
	
	private adicionaAnexo(): void
	{
		let title = 'Enviar Arquivo';
		let data = 
		{
			id: 0
		};

		const ref = this.modalService.open(AnexoUploadComponent, 
		{
			header: title,
			data: data,
			width: '40%'
		});

		ref.onClose.subscribe((result: ListResult<Anexo>) => 
		{
			if(result != null)
			{
				if(result.IsValid)
				{
					this.anexos = result;
					this.insereAnexos();
				}
			}
		});
	}

	private insereAnexos(): void
	{
		if(this.vm.Id != 0 && this.anexos.Items.length > 0)
		{
			//cria objetos
			let lista = new Array<PedidoAnexo>();

			//carre a lista
			this.anexos.Items.forEach((value, index, result) => 
			{
				let item = new PedidoAnexo();
				item.IdPedido = this.vm.Id;
				item.IdAnexo = value.Id;
				item.Data = CommonHelper.getToday();

				lista.push(item);
			});

			//adiciona registro
			this.loading.Status = true;

			this.pedidoAnexoService
				.insereVarios(lista)
				.then((result) => 
				{
					if(result.IsValid)
					{
						this.anexos = new ListResult<Anexo>();
						this.carregaAnexos();
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
		else
		{
			if(this.vm.Id == 0)
				this.insere();
		}
	}

	private deletaAnexo(item: PedidoAnexo): void
	{
		this.loading.Status = true;

		this.pedidoAnexoService
			.deleta(item.IdPedido, item.IdAnexo)
			.then((result) => 
			{
				if(result.IsValid)
				{
					this.carregaAnexos();
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

	private carregaDefaultsCliente(): void
	{
		let cliente = this.clientesList.Items.find(a => a.Id === this.vm.IdCliente);

		if(cliente)
		{
			if(cliente.ValorFreteTonelada !== 0)
			{
				this.vm.FreteUnitario = cliente.ValorFreteTonelada;
				this.calculaFreteTotal();
			}
				

			if(cliente.ValorFreteG3 !== 0)
			{
				this.vm.ComissaoUnitario = cliente.ValorFreteG3;
				this.calculaComissaoTotal();
			}
		}
	}

	private calculaFreteTotal(): void
	{
		this.vm.ValorFrete = (this.vm.FreteUnitario * this.vm.Quantidade) + this.vm.ValorPedagioCliente + this.vm.ValorPegadioG3;
		this.calculaTotais();
	}

	private calculaFreteTonelada(): void
	{
		if(this.vm.Quantidade != 0)
		{
			this.vm.FreteUnitario = this.vm.ValorFrete / this.vm.Quantidade;
			
		}

		this.calculaTotais();
	}

	private calculaComissaoTotal(): void
	{
		this.vm.ValorComissao = (this.vm.ComissaoUnitario * this.vm.Quantidade) + this.vm.ValorPegadioG3;
		this.calculaTotais();
	}

	private calculaComissaoTonelada(): void
	{
		if(this.vm.Quantidade != 0)
		{
			this.vm.ComissaoUnitario = this.vm.ValorComissao / this.vm.Quantidade;			
		}
		this.calculaTotais();
		
	}

	private calculaValorBruto(): void
	{
		this.vm.ValorBruto = this.vm.ValorFrete + this.vm.ValorComissao;

		if(this.vm.Quantidade != 0)
		{
			this.vm.ValorUnitario = this.vm.ValorBruto / this.vm.Quantidade;
		}
		else
		{
			this.vm.ValorUnitario = 0;
		}
	}

	private calculaValorLiquido(): void
	{
		this.vm.ValorLiquido = this.vm.ValorComissao - this.vm.ValorPedagio - this.vm.ValorAcrescimo + this.vm.ValorDesconto;
	}

	private calculaMargem(): void
	{
		this.vm.ComissaoMargem = this.vm.ValorLiquido - this.vm.ValorFrete;
	}

	private calculaTotais(): void
	{
		this.calculaValorBruto();
		this.calculaValorLiquido();
		this.calculaMargem();
	}

	public onSalvar_Click(): void
	{
		if(this.vm.Id == 0)
			this.insere();
		else
			this.atualiza();
	}

	public onOrdemServico_Change(): void
	{
		this.geraOrdemServico();
		console.log(this.vm.DataCriacao);
	}

	public onAdicionaCliente_Click(): void
	{
		this.adicionaCliente();
	}

	public onAdicionaCaminhao_Click(): void
	{
		this.adicionaCaminhao();
	}

	public onAdicionaRemetente_Click(): void
	{
		this.adicionaRemetente();
	}

	public onAdicionaEstoque_Click(): void
	{
		this.adicionaEstoque();
	}

	public onAdicionaAnexo_Click(): void
	{
		this.adicionaAnexo();
	}

	public onDeletaAnexo_Click(item: PedidoAnexo): void
	{
		let title = 'Confirmação de exclusão';
		let message = 'Tem certeza que deseja excluir o registro ' + item.Anexo.Nome + '?'
		
		this.dialogService.confirm(title, message, () => 
		{
			this.deletaAnexo(item);
		}, null);
	}

	public onCliente_Change(): void
	{
		this.carregaDefaultsCliente();
	}

	public onQuantidade_Change(): void
	{
		this.calculaFreteTotal();
		this.calculaComissaoTotal();
	}
	
	public onFreteTotal_Change(): void
	{
		this.calculaFreteTonelada();
	}

	public onFreteTonelada_Change(): void
	{
		this.calculaFreteTotal();
	}
	
	public onComissaoTotal_Change(): void
	{
		this.calculaComissaoTonelada();
	}
	
	public onComissaoTonelada_Change(): void
	{
		this.calculaFreteTotal();
		this.calculaComissaoTotal();
	}

	public onPedagio_Change(): void
	{
		this.calculaTotais();
	}

	public onDespesas_Change(): void
	{
		this.calculaTotais();
	}

	public onDesconto_Change(): void
	{
		this.calculaTotais();
	}
}
