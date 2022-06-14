import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TemplateAppComponent } from './templates/template-app/template-app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TemplateLoginComponent } from './templates/template-login/template-login.component';
import { LoginComponent } from './components/autenticacao/login/login.component';
import { ConfiguracaoComponent } from './components/configuracao/configuracao.component';
import { UsuarioListaComponent } from './components/usuario/usuario-lista/usuario-lista.component';
import { ClienteListaComponent } from './components/cliente/cliente-lista/cliente-lista.component';
import { CaminhaoListaComponent } from './components/caminhao/caminhao-lista/caminhao-lista.component';
import { MotoristaListaComponent } from './components/motorista/motorista-lista/motorista-lista.component';
import { FormaPagamentoListaComponent } from './components/forma-pagamento/forma-pagamento-lista/forma-pagamento-lista.component';
import { PedidoListaComponent } from './components/pedido/pedido-lista/pedido-lista.component';
import { LancamentoListaComponent } from './components/lancamento/lancamento-lista/lancamento-lista.component';
import { ReportLancamentoAbertoComponent } from './reports/report-lancamento-aberto/report-lancamento-aberto.component';
import { ReportLancamentoBaixadoComponent } from './reports/report-lancamento-baixado/report-lancamento-baixado.component';
import { ReportPedidoListaComponent } from './reports/report-pedido-lista/report-pedido-lista.component';
import { CentroCustoListaComponent } from './components/centro-custo/centro-custo-lista/centro-custo-lista.component';
import { TipoDocumentoListaComponent } from './components/tipo-documento/tipo-documento-lista/tipo-documento-lista.component';
import { ContaBancariaListaComponent } from './components/conta-bancaria/conta-bancaria-lista/conta-bancaria-lista.component';
import { ProprietarioListaComponent } from './components/proprietario/proprietario-lista/proprietario-lista.component';
import { RemetenteListaComponent } from './components/remetente/remetente-lista/remetente-lista.component';
import { ReportLancamentoAgrupadoComponent } from './reports/report-lancamento-agrupado/report-lancamento-agrupado.component';
import { ReportExtratoComponent } from './reports/report-extrato/report-extrato.component';
import { EstoqueListaComponent } from './components/estoque/estoque-lista/estoque-lista.component';
import { ReportEstoqueDevolucaoComponent } from './reports/report-estoque-devolucao/report-estoque-devolucao.component';
import { ReportEstoqueListaComponent } from './reports/report-estoque-lista/report-estoque-lista.component';
import { ReportEstoqueMovimentacaoComponent } from './reports/report-estoque-movimentacao/report-estoque-movimentacao.component';
import { ConciliacaoListaComponent } from './components/conciliacao/conciliacao-lista/conciliacao-lista.component';


const routes: Routes = 
[
	{ 
        path: '', 
		component: TemplateAppComponent,
		children: 
		[
			{
				path: '',
				component: DashboardComponent
			}
		]
	},
	{ 
        path: '', 
		component: TemplateLoginComponent,
		children: 
		[
			{
				path: 'autenticacao/login',
				component: LoginComponent
			}
		]
	},
	{ 
        path: 'configuracao', 
		component: TemplateAppComponent,
		children: 
		[
			{
				path: 'geral',
				component: ConfiguracaoComponent
			},
			{
				path: 'usuario',
				component: UsuarioListaComponent
			}
		]
	},
	{ 
        path: 'cadastro', 
		component: TemplateAppComponent,
		children: 
		[
			{
				path: 'cliente',
				component: ClienteListaComponent
			},
			{
				path: 'caminhao',
				component: CaminhaoListaComponent
			},
			{
				path: 'motorista',
				component: MotoristaListaComponent
			},
			{
				path: 'proprietario',
				component: ProprietarioListaComponent
			},
			{
				path: 'remetente',
				component: RemetenteListaComponent
			},
			{
				path: 'plano-conta',
				component: CentroCustoListaComponent
			},
			{
				path: 'tipo-documento',
				component: TipoDocumentoListaComponent
			},
			{
				path: 'conta-bancaria',
				component: ContaBancariaListaComponent
			},
			{
				path: 'forma-pagamento',
				component: FormaPagamentoListaComponent
			}
		]
	},
	{ 
        path: 'movimento', 
		component: TemplateAppComponent,
		children: 
		[
			{
				path: 'pedido',
				component: PedidoListaComponent
			},
			{
				path: 'lancamento',
				component: LancamentoListaComponent
			},
			{
				path: 'conciliacao',
				component: ConciliacaoListaComponent
			},
			{
				path: 'estoque',
				component: EstoqueListaComponent
			}
		]
	},
	
	{
		path: 'relatorio', 
		component: TemplateAppComponent,
		children: 
		[
			{
				path: 'financeiro/aberto',
				component: ReportLancamentoAbertoComponent
			},
			{
				path: 'financeiro/baixado',
				component: ReportLancamentoBaixadoComponent
			},
			{
				path: 'financeiro/extrato',
				component: ReportExtratoComponent
			},
			{
				path: 'financeiro/agrupado/:tipo',
				component: ReportLancamentoAgrupadoComponent
			},
			{
				path: 'pedido/lista',
				component: ReportPedidoListaComponent
			},
			{
				path: 'estoque/devolucao',
				component: ReportEstoqueDevolucaoComponent
			},
			{
				path: 'estoque/lista',
				component: ReportEstoqueListaComponent
			},
			{
				path: 'estoque/movimentacao',
				component: ReportEstoqueMovimentacaoComponent
			}
		]
	}


];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})

export class AppRoutingModule { }
