import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { GlobalService } from 'src/app/services/global.service';
import { LocalStorageService } from 'angular-2-local-storage';

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit 
{
	public items: MenuItem[] = new Array<MenuItem>();

	constructor(private globalService: GlobalService, private localStorageService: LocalStorageService) 
	{ 

	}

	ngOnInit() 
	{
		this.geraMenu();
	}

	private geraMenu(): void
	{
		this.menuDashboard();
		this.menuCadastro();
		this.menuMovimento();
		this.menuRelatorios();
		this.menuConfiguracao();
		this.menuLogout();
	}

	private menuDashboard(): void
	{
		let item: MenuItem = 
		{
			label: 'Dashboard',
			icon: 'pi pi-desktop',
			routerLink: '/'
		}

		this.items.push(item);
	}
	
	private menuCadastro(): void
	{
		let item: MenuItem = 
		{
			label: 'Cadastros',
			icon: 'pi pi-file-o',
			items: 
			[
				{
					label: 'Clientes',
					routerLink: '/cadastro/cliente'
				},
				{
					label: 'Motoristas',
					routerLink: '/cadastro/motorista'
				},
				{
					label: 'Caminhões',
					routerLink: '/cadastro/caminhao'
				},
				{
					label: 'Proprietários',
					routerLink: '/cadastro/proprietario'
				},
				{
					label: 'Remetentes',
					routerLink: '/cadastro/remetente'
				},
				{ 
					separator:true 
				},
				{
					label: 'Plano de Contas',
					routerLink: '/cadastro/plano-conta'
				},
				{
					label: 'Tipos de Documento',
					routerLink: '/cadastro/tipo-documento'
				},
				{
					label: 'Contas Bancárias',
					routerLink: '/cadastro/conta-bancaria'
				},
				{
					label: 'Formas de Pagamento',
					routerLink: '/cadastro/forma-pagamento'
				}
			]
		}

		this.items.push(item);
	}

	private menuMovimento(): void
	{
		let item: MenuItem = 
		{
			label: 'Movimentações',
			icon: 'pi pi-money-bill',
			items: 
			[
				{
					label: 'Pedidos',
					routerLink: '/movimento/pedido'
				},
				{ 
					separator:true 
				},
				{
					label: 'Contas a Pagar e Receber',
					routerLink: '/movimento/lancamento'
				},
				{
					label: 'Conciliação Bancária',
					routerLink: '/movimento/conciliacao'
				},
				{ 
					separator:true 
				},
				{
					label: 'Estoque',
					routerLink: '/movimento/estoque'
				}
			]
		}

		this.items.push(item);
	}

	private menuRelatorios(): void
	{
		let item: MenuItem = 
		{
			label: 'Relatórios',
			icon: 'pi pi-chart-bar',
			items: 
			[
				{
					label: 'Contas a Pagar e Receber',
					routerLink: '/relatorio/financeiro/aberto'
				},
				{
					label: 'Contas Pagas e Recebidas',
					routerLink: '/relatorio/financeiro/baixado'
				},
				{ 
					separator:true 
				},
				{
					label: 'Extrato Bancário',
					routerLink: '/relatorio/financeiro/extrato'
				},
				{ 
					separator:true 
				},
				{
					label: 'Resumo Por Cliente',
					routerLink: '/relatorio/financeiro/agrupado/cliente',
				},
				{
					label: 'Resumo Por Caminhão',
					routerLink: '/relatorio/financeiro/agrupado/caminhao',
				},
				{
					label: 'Resumo Por Proprietário',
					routerLink: '/relatorio/financeiro/agrupado/proprietario',
				},
				{
					label: 'Resumo Por Conta Gerencial',
					routerLink: '/relatorio/financeiro/agrupado/plano-conta',
				},
				{ 
					separator:true 
				},
				{
					label: 'Ordens de Serviço',
					routerLink: '/relatorio/pedido/lista'
				},
				{ 
					separator:true 
				},
				{
					label: 'Estoque para Devolução',
					routerLink: '/relatorio/estoque/devolucao'
				},
				{
					label: 'Listagem de Estoques',
					routerLink: '/relatorio/estoque/lista'
				},
				{
					label: 'Movimentações de Estoque',
					routerLink: '/relatorio/estoque/movimentacao'
				}
			]
		}

		this.items.push(item);
	}

	private menuConfiguracao(): void
	{
		let item: MenuItem = 
		{
			label: 'Configurações',
			icon: 'pi pi-cog',
			items: 
			[
				{
					label: 'Dados da Empresa',
					routerLink: '/configuracao/geral'
				},
				{ 
					separator:true 
				},
				{
					label: 'Usuários',
					routerLink: '/configuracao/usuario'
				}
			]
		}

		this.items.push(item);
	}

	private menuLogout(): void
	{
		let item: MenuItem = 
		{
			label: 'Logout',
			icon: 'pi pi-sign-out',
			command: () => 
			{
				this.localStorageService.remove('usuario');
				this.globalService.currentUser = null;
				
				this.globalService.verificaLogado();
			}
		}

		this.items.push(item);
	}
}
