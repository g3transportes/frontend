import { Component, OnInit, Input } from '@angular/core';
import { DialogService, DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Lancamento } from 'src/app/models/lancamento.model';
import { SelectItem } from 'primeng/api/selectitem';
import { Loading } from 'src/app/helpers/loading.helper';
import { LancamentoService } from 'src/app/services/lancamento.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { CaminhaoService } from 'src/app/services/caminhao.service';
import { FormaPagamentoService } from 'src/app/services/forma-pagamento.service';
import { DialogServiceHelper } from 'src/app/services/dialog.service';
import { CommonHelper } from 'src/app/helpers/common.helper';
import { ClienteFilter } from 'src/app/filters/cliente.filter';
import { CaminhaoFilter } from 'src/app/filters/caminhao.filter';
import { DialogTypeEnum } from 'src/app/enums/dialog-type.enum';
import { ClienteEditaComponent } from '../../cliente/cliente-edita/cliente-edita.component';
import { Cliente } from 'src/app/models/cliente.model';
import { CaminhaoEditaComponent } from '../../caminhao/caminhao-edita/caminhao-edita.component';
import { Caminhao } from 'src/app/models/caminhao.model';
import { ListResult } from 'src/app/helpers/list-result.helper';
import { Anexo } from 'src/app/models/anexo.model';
import { LancamentoBaixa } from 'src/app/models/lancamento-baixa.model';
import { LancamentoAnexoFilter } from 'src/app/filters/lancamento-anexo.filter';
import { LancamentoAnexoService } from 'src/app/services/lancamento-anexo.service';
import { LancamentoBaixaService } from 'src/app/services/lancamento-baixa.service';
import { AnexoUploadComponent } from '../../anexo/anexo-upload/anexo-upload.component';
import { LancamentoAnexo } from 'src/app/models/lancamento-anexo.model';
import { LancamentoBaixaFilter } from 'src/app/filters/lancamento-baixa.filter';
import { LancamentoBaixaComponent } from '../lancamento-baixa/lancamento-baixa.component';
import { ItemResult } from 'src/app/helpers/item-result.helper';
import { CentroCustoService } from 'src/app/services/centro-custo.service';
import { ContaBancariaService } from 'src/app/services/conta-bancaria.service';
import { TipoDocumentoService } from 'src/app/services/tipo-documento.service';
import { FormaPagamentoEditaComponent } from '../../forma-pagamento/forma-pagamento-edita/forma-pagamento-edita.component';
import { FormaPagamento } from 'src/app/models/forma-pagamento.model';
import { ContaBancariaEditaComponent } from '../../conta-bancaria/conta-bancaria-edita/conta-bancaria-edita.component';
import { ContaBancaria } from 'src/app/models/conta-bancaria.model';
import { CentroCusto } from 'src/app/models/centro-custo.model';
import { CentroCustoEditaComponent } from '../../centro-custo/centro-custo-edita/centro-custo-edita.component';
import { TipoDocumentoEditaComponent } from '../../tipo-documento/tipo-documento-edita/tipo-documento-edita.component';
import { TipoDocumento } from 'src/app/models/tipo-documento.model';

@Component({
	selector: 'app-lancamento-edita',
	templateUrl: './lancamento-edita.component.html',
	styleUrls: ['./lancamento-edita.component.css'],
	providers: [ DialogService ]
})
export class LancamentoEditaComponent implements OnInit
{

	@Input() public id: number;
	@Input() public tipo: string;
	public vm: Lancamento = new Lancamento();
	public anexos: ListResult<Anexo> = new ListResult<Anexo>();
	public baixas: ListResult<LancamentoBaixa> = new ListResult<LancamentoBaixa>();
	public tipos: SelectItem[];
	public clientes: SelectItem[];
	public caminhoes: SelectItem[];
	public formasPagamento: SelectItem[];
	public centrosCusto: SelectItem[];
	public contasBancarias: SelectItem[];
	public tiposDocumento: SelectItem[];
	public loading: Loading = new Loading();
	public localeBR: any;

	constructor(private lancamentoService: LancamentoService,
		private lancamentoAnexoService: LancamentoAnexoService,
		private lancamentoBaixaService: LancamentoBaixaService,
		private clienteService: ClienteService,
		private caminhaoService: CaminhaoService,
		private formaPagamentoService: FormaPagamentoService,
		private centroCustoService: CentroCustoService,
		private contaBancariaService: ContaBancariaService,
		private tipoDocumentoService: TipoDocumentoService,
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
		this.tipo = this.config.data.tipo;

		//inicializa locale
		this.localeBR = CommonHelper.calendarLocale();

		//carrega item

		this.carregaItem();
	}

	private inicializaListas()
	{
		this.carregaTipos();
		this.carregaClientes();
		this.carregaCaminhoes();
		this.carregaFormasPagamento();
		this.carregaCentrosCusto();
		this.carregaContasBancarias();
		this.carregaTiposDocumento();
		this.carregaAnexos();
		this.carregaBaixas();
	}

	private carregaTipos(): void
	{
		this.tipos = new Array<SelectItem>();

		this.tipos.push({ label: 'Entrada', value: 'C' });
		this.tipos.push({ label: 'Saída', value: 'D' });
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
					this.clientes = new Array<SelectItem>();
					this.clientes.push({ label: 'Nenhum cliente selecionado', value: null });

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

	private carregaFormasPagamento(): void
	{
		//inicializa o loading
		this.loading.Status = true;

		//executa consulta
		this.formaPagamentoService
			.pegaLista()
			.then((result) =>
			{
				if(result.IsValid)
				{
					this.formasPagamento = new Array<SelectItem>();
					this.formasPagamento.push({ label: 'Nenhum', value: 0 });

					result.Items.forEach((item, index, array) =>
					{
						this.formasPagamento.push({ label: item.Nome, value: item.Id });
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

	private carregaCentrosCusto(): void
	{
		//inicializa o loading
		this.loading.Status = true;

		//executa consulta
		this.centroCustoService
			.pegaLista()
			.then((result) =>
			{
				if(result.IsValid)
				{
					this.centrosCusto = new Array<SelectItem>();
					this.centrosCusto.push({ label: 'Nenhum', value: null });

					result.Items.forEach((item, index, array) =>
					{
						if(this.vm.Tipo === item.Tipo)
						{
							if(item.UltimoNivel === true || item.Id === this.vm.IdCentroCusto)
							{
								this.centrosCusto.push({ label: item.Nome, value: item.Id });
							}
						}
					});

					//inicializa centro de custo
					if(this.vm.IdCentroCusto != null && this.vm.IdCentroCusto != undefined)
					{
						if(this.centrosCusto.findIndex(a => a.value == this.vm.IdCentroCusto) == -1)
							this.vm.IdCentroCusto = result.Items.find(a => a.Padrao == true && a.Tipo == this.vm.Tipo).Id;
					}
					else
					{
						this.vm.IdCentroCusto = result.Items.find(a => a.Padrao == true && a.Tipo == this.vm.Tipo).Id;
					}

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

	private carregaContasBancarias(): void
	{
		//inicializa o loading
		this.loading.Status = true;

		//executa consulta
		this.contaBancariaService
			.pegaLista()
			.then((result) =>
			{
				if(result.IsValid)
				{
					this.contasBancarias = new Array<SelectItem>();
					this.contasBancarias.push({ label: 'Nenhum', value: null });

					result.Items.forEach((item, index, array) =>
					{
						this.contasBancarias.push({ label: item.Nome, value: item.Id });
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

	private carregaTiposDocumento(): void
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
					this.tiposDocumento = new Array<SelectItem>();
					this.tiposDocumento.push({ label: 'Nenhum', value: null });

					result.Items.forEach((item, index, array) =>
					{
						this.tiposDocumento.push({ label: item.Nome, value: item.Id });
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

			this.lancamentoService
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
				this.inicializaListas();
			});
		}
		else
		{
			this.vm = new Lancamento();
			//this.vm.Tipo = this.tipo;
			this.inicializaListas();
		}
	}

	private formataDatas(): void
	{
		//resolve probelmas de data
		this.vm.DataEmissao = CommonHelper.setDate(this.vm.DataEmissao);

		if(this.vm.DataVencimento)
			this.vm.DataVencimento = CommonHelper.setDate(this.vm.DataVencimento);

		if(this.vm.DataBaixa)
			this.vm.DataBaixa = CommonHelper.setDate(this.vm.DataBaixa);
	}

	private valida(): boolean
	{
		let isValid = true;
		let errors = new Array<string>();

		if(this.vm.IdFormaPagamento == 0)
		{
			isValid = false;
			errors.push('Informe a forma de pagamento');
		}

		if(!this.vm.DataEmissao)
		{
			this.vm.DataEmissao = CommonHelper.getToday();
		}

		if(!this.vm.ValorDesconto)
		{
			this.vm.ValorDesconto = 0;
		}

		if(!this.vm.ValorAcrescimo)
		{
			this.vm.ValorAcrescimo = 0;
		}

		if(!this.vm.ValorBruto)
		{
			this.vm.ValorBruto = 0;
		}

		if(!this.vm.ValorLiquido)
		{
			this.vm.ValorLiquido = 0;
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

			this.lancamentoService
				.insere(this.vm)
				.then((result) =>
				{
					if(result.IsValid)
					{
						this.vm = result.Item;
						this.formataDatas();

						this.dialogService.alert('Informações do sistema', ['Dados incluídos com sucesso'], DialogTypeEnum.Sucesso, () =>
						{
							this.id = this.vm.Id;
							this.carregaItem();
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

			this.lancamentoService
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
		let title = 'Novo Registro';
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
				this.carregaCaminhoes();
				this.vm.IdCaminhao = result.Id;
			}
		});
	}

	private adicionaFormaPagamento(): void
	{
		let title = 'Nova Forma de Pagamento';
		let data =
		{
			id: 0
		};

		const ref = this.modalService.open(FormaPagamentoEditaComponent,
		{
			header: title,
			data: data,
			width: '60%'
		});

		ref.onClose.subscribe((result: FormaPagamento) =>
		{
			if(result != null)
			{
				this.carregaFormasPagamento();
				this.vm.IdFormaPagamento = result.Id;
			}
		});
	}

	private adicionaContaBancaria(): void
	{
		let title = 'Nova Conta / Caixa';
		let data =
		{
			id: 0
		};

		const ref = this.modalService.open(ContaBancariaEditaComponent,
		{
			header: title,
			data: data,
			width: '60%'
		});

		ref.onClose.subscribe((result: ContaBancaria) =>
		{
			if(result != null)
			{
				this.carregaContasBancarias();
				this.vm.IdContaBancaria = result.Id;
			}
		});
	}

	private adicionaCentroCusto(): void
	{
		let title = 'Novo Centro de Custo';
		let data =
		{
			id: 0
		};

		const ref = this.modalService.open(CentroCustoEditaComponent,
		{
			header: title,
			data: data,
			width: '60%'
		});

		ref.onClose.subscribe((result: CentroCusto) =>
		{
			if(result != null)
			{
				this.carregaCentrosCusto();
				this.vm.IdCentroCusto = result.Id;
			}
		});
	}

	private adicionaTipoDocumento(): void
	{
		let title = 'Novo Tipo de Documento';
		let data =
		{
			id: 0
		};

		const ref = this.modalService.open(TipoDocumentoEditaComponent,
		{
			header: title,
			data: data,
			width: '60%'
		});

		ref.onClose.subscribe((result: TipoDocumento) =>
		{
			if(result != null)
			{
				this.carregaTiposDocumento();
				this.vm.IdTipoDocumento = result.Id;
			}
		});
	}

	private calculaValorLiquido(): void
	{
		this.vm.ValorLiquido = this.vm.ValorBruto + this.vm.ValorAcrescimo - this.vm.ValorDesconto;
		this.vm.ValorSaldo = this.vm.ValorLiquido - this.vm.ValorBaixado;
	}

	private carregaAnexos(): void
	{
		if(this.vm.Id != 0)
		{
			let filtro = new LancamentoAnexoFilter();
			filtro.LancamentoFilter = true;
			filtro.LancamentoValue = this.vm.Id;

			this.loading.Status = true

			this.lancamentoAnexoService
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
			let lista = new Array<LancamentoAnexo>();

			//carre a lista
			this.anexos.Items.forEach((value, index, result) =>
			{
				let item = new LancamentoAnexo();
				item.IdLancamento = this.vm.Id;
				item.IdAnexo = value.Id;
				item.Data = CommonHelper.getToday();

				lista.push(item);
			});

			//adiciona registro
			this.loading.Status = true;

			this.lancamentoAnexoService
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

	private deletaAnexo(item: LancamentoAnexo): void
	{
		this.loading.Status = true;

		this.lancamentoAnexoService
			.deleta(item.IdLancamento, item.IdAnexo)
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



	private carregaBaixas(): void
	{
		if(this.vm.Id != 0)
		{
			let filtro = new LancamentoBaixaFilter();
			filtro.LancamentoFilter = true;
			filtro.LancamentoValue = this.vm.Id;

			this.loading.Status = true

			this.lancamentoBaixaService
				.pegaLista(filtro, 1, 1000)
				.then((result) =>
			{
				if(result.IsValid)
				{
					this.vm.Baixas = result.Items;
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

	private adicionaBaixa(): void
	{
		let title = 'Adiciona Baixa';
		let data =
		{
			id: 0,
			idLancamento: this.vm.Id
		};

		const ref = this.modalService.open(LancamentoBaixaComponent,
		{
			header: title,
			data: data,
			width: '50%'
		});

		ref.onClose.subscribe((result: ItemResult<LancamentoBaixa>) =>
		{
			this.carregaItem();
		});
	}

	private editaBaixa(item: LancamentoBaixa): void
	{
		let title = 'Edita Baixa';
		let data =
		{
			id: item.Id,
			idLancamento: item.IdLancamento
		};

		const ref = this.modalService.open(LancamentoBaixaComponent,
		{
			header: title,
			data: data,
			width: '50%'
		});

		ref.onClose.subscribe((result: ItemResult<LancamentoBaixa>) =>
		{
			this.carregaItem();
		});
	}

	private deletaBaixa(item: LancamentoBaixa): void
	{
		this.loading.Status = true;

		this.lancamentoBaixaService
			.deleta(item.Id)
			.then((result) =>
			{
				if(result.IsValid)
				{
					this.dialogService.alert('Informações do sistema', ['Baixa incluída com sucesso'], DialogTypeEnum.Sucesso, () =>
					{
						this.carregaItem();
					});
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



	public onSalvar_Click(): void
	{
		if(this.vm.Id == 0)
			this.insere();
		else
			this.atualiza();
	}

	public onAdicionaCliente_Click(): void
	{
		this.adicionaCliente();
	}

	public onAdicionaCaminhao_Click(): void
	{
		this.adicionaCaminhao();
	}

	public onAdicionaCentroCusto_Click(): void
	{
		this.adicionaCentroCusto();
	}

	public onAdicionaTipoDocumento_Click(): void
	{
		this.adicionaTipoDocumento();
	}

	public onAdicionaContaBancaria_Click(): void
	{
		this.adicionaContaBancaria();
	}

	public onAdicionaFormaPagamento_Click(): void
	{
		this.adicionaFormaPagamento();
	}

	public onValor_Change(): void
	{
		this.calculaValorLiquido();
	}

	public onAdicionaAnexo_Click(): void
	{
		this.adicionaAnexo();
	}

	public onDeletaAnexo_Click(item: LancamentoAnexo): void
	{
		let title = 'Confirmação de exclusão';
		let message = 'Tem certeza que deseja excluir o registro ' + item.Anexo.Nome + '?'

		this.dialogService.confirm(title, message, () =>
		{
			this.deletaAnexo(item);
		}, null);
	}

	public onAdicionaBaixa_Click(): void
	{
		this.adicionaBaixa();
	}

	public onEditaBaixa_Click(item: LancamentoBaixa): void
	{
		this.editaBaixa(item);
	}

	public onDeletaBaixa_Click(item: LancamentoBaixa): void
	{
		let title = 'Confirmação de exclusão';
		let message = 'Tem certeza que deseja excluir a baixa?'

		this.dialogService.confirm(title, message, () =>
		{
			this.deletaBaixa(item);
		}, null);
	}

	public onTipo_Change(): void
	{
		this.carregaCentrosCusto();
	}
}
