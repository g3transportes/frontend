//#region Angular Modules

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule }   from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, LOCALE_ID } from '@angular/core';
import { LocalStorageModule } from 'angular-2-local-storage';
import { PrimengBrUtilsModule } from 'primeng-br-utils';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

//#endregion

//#region DIRETIVAS


//#endregion

//#region PrimeNG Modules

import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { BlockUIModule } from 'primeng/blockui';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DialogService } from 'primeng/dynamicdialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MenuModule } from 'primeng/menu';
import { MenubarModule} from 'primeng/menubar';
import { MultiSelectModule } from 'primeng/multiselect';
import { PasswordModule } from 'primeng/password';
import { PanelModule } from 'primeng/panel';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SplitButtonModule } from 'primeng/splitbutton';
import { StepsModule } from 'primeng/steps';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { TreeTableModule } from 'primeng/treetable';
import { TooltipModule } from 'primeng/tooltip';
import { FileUploadModule } from 'primeng/fileupload';
import {ToastModule} from 'primeng/toast';


//#endregion

//#region Application Components

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//#endregion

//#region Application Services

import { GlobalService } from './services/global.service';
import { LoginComponent } from './components/autenticacao/login/login.component';
import { LogoutComponent } from './components/autenticacao/logout/logout.component';
import { TemplateAppComponent } from './templates/template-app/template-app.component';
import { TemplateLoginComponent } from './templates/template-login/template-login.component';
import { MenuComponent } from './components/comum/menu/menu.component';
import { UploadComponent } from './components/comum/upload/upload.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ConfiguracaoComponent } from './components/configuracao/configuracao.component';
import { UsuarioListaComponent } from './components/usuario/usuario-lista/usuario-lista.component';
import { UsuarioEditaComponent } from './components/usuario/usuario-edita/usuario-edita.component';
import { ClienteListaComponent } from './components/cliente/cliente-lista/cliente-lista.component';
import { ClienteEditaComponent } from './components/cliente/cliente-edita/cliente-edita.component';
import { CaminhaoListaComponent } from './components/caminhao/caminhao-lista/caminhao-lista.component';
import { CaminhaoEditaComponent } from './components/caminhao/caminhao-edita/caminhao-edita.component';
import { MotoristaListaComponent } from './components/motorista/motorista-lista/motorista-lista.component';
import { MotoristaEditaComponent } from './components/motorista/motorista-edita/motorista-edita.component';
import { FormaPagamentoListaComponent } from './components/forma-pagamento/forma-pagamento-lista/forma-pagamento-lista.component';
import { FormaPagamentoEditaComponent } from './components/forma-pagamento/forma-pagamento-edita/forma-pagamento-edita.component';
import { PedidoListaComponent } from './components/pedido/pedido-lista/pedido-lista.component';
import { PedidoEditaComponent } from './components/pedido/pedido-edita/pedido-edita.component';
import { LancamentoListaComponent } from './components/lancamento/lancamento-lista/lancamento-lista.component';
import { LancamentoEditaComponent } from './components/lancamento/lancamento-edita/lancamento-edita.component';
import { AnexoService } from './services/anexo.service';
import { CaminhaoAnexoService } from './services/caminhao-anexo.service';
import { CaminhaoService } from './services/caminhao.service';
import { ClienteService } from './services/cliente.service';
import { ClienteAnexoService } from './services/cliente-anexo.service';
import { ConfiguracaoService } from './services/configuracao.service';
import { FormaPagamentoService } from './services/forma-pagamento.service';
import { LancamentoService } from './services/lancamento.service';
import { MotoristaAnexoService } from './services/motorista-anexo.service';
import { MotoristaService } from './services/motorista.service';
import { PedidoService } from './services/pedido.service';
import { PedidoAnexoService } from './services/pedido-anexo.service';
import { UsuarioService } from './services/usuario.service';
import { DialogServiceHelper } from './services/dialog.service';
import { UsuarioEditaSenhaComponent } from './components/usuario/usuario-edita-senha/usuario-edita-senha.component';
import { AnexoUploadComponent } from './components/anexo/anexo-upload/anexo-upload.component';
import { AnexoListaComponent } from './components/anexo/anexo-lista/anexo-lista.component';
import { PedidoFinalizaComponent } from './components/pedido/pedido-finaliza/pedido-finaliza.component';
import { LancamentoBaixaComponent } from './components/lancamento/lancamento-baixa/lancamento-baixa.component';
import { PedidoEntregaComponent } from './components/pedido/pedido-entrega/pedido-entrega.component';
import { ReportLancamentoAbertoComponent } from './reports/report-lancamento-aberto/report-lancamento-aberto.component';
import { ReportLancamentoBaixadoComponent } from './reports/report-lancamento-baixado/report-lancamento-baixado.component';
import { ReportPedidoListaComponent } from './reports/report-pedido-lista/report-pedido-lista.component';
import { ReportPedidoDetalheComponent } from './reports/report-pedido-detalhe/report-pedido-detalhe.component';
import { TipoDocumentoListaComponent } from './components/tipo-documento/tipo-documento-lista/tipo-documento-lista.component';
import { TipoDocumentoEditaComponent } from './components/tipo-documento/tipo-documento-edita/tipo-documento-edita.component';
import { CentroCustoListaComponent } from './components/centro-custo/centro-custo-lista/centro-custo-lista.component';
import { CentroCustoEditaComponent } from './components/centro-custo/centro-custo-edita/centro-custo-edita.component';
import { ContaBancariaListaComponent } from './components/conta-bancaria/conta-bancaria-lista/conta-bancaria-lista.component';
import { ContaBancariaEditaComponent } from './components/conta-bancaria/conta-bancaria-edita/conta-bancaria-edita.component';
import { ProprietarioListaComponent } from './components/proprietario/proprietario-lista/proprietario-lista.component';
import { ProprietarioEditaComponent } from './components/proprietario/proprietario-edita/proprietario-edita.component';
import { RemetenteListaComponent } from './components/remetente/remetente-lista/remetente-lista.component';
import { RemetenteEditaComponent } from './components/remetente/remetente-edita/remetente-edita.component';
import { ReportLancamentoAgrupadoComponent } from './reports/report-lancamento-agrupado/report-lancamento-agrupado.component';
import { ReportExtratoComponent } from './reports/report-extrato/report-extrato.component';
import { EstoqueListaComponent } from './components/estoque/estoque-lista/estoque-lista.component';
import { EstoqueEditaComponent } from './components/estoque/estoque-edita/estoque-edita.component';
import { CentroCustoService } from './services/centro-custo.service';
import { ContaBancariaService } from './services/conta-bancaria.service';
import { EstadoService } from './services/estado.service';
import { LancamentoAnexoService } from './services/lancamento-anexo.service';
import { LancamentoBaixaService } from './services/lancamento-baixa.service';
import { ProprietarioService } from './services/proprietario.service';
import { ProprietarioAnexoService } from './services/proprietario-anexo.service';
import { RemetenteService } from './services/remetente.service';
import { RemetenteAnexoService } from './services/remetente-anexo.service';
import { RemetenteEstoqueService } from './services/remetente-estoque.service';
import { TipoDocumentoService } from './services/tipo-documento.service';
import { ReportEstoqueDevolucaoComponent } from './reports/report-estoque-devolucao/report-estoque-devolucao.component';
import { ReportEstoqueListaComponent } from './reports/report-estoque-lista/report-estoque-lista.component';
import { ReportEstoqueMovimentacaoComponent } from './reports/report-estoque-movimentacao/report-estoque-movimentacao.component';
import { ConciliacaoListaComponent } from './components/conciliacao/conciliacao-lista/conciliacao-lista.component';
import { ConciliacaoEditaComponent } from './components/conciliacao/conciliacao-edita/conciliacao-edita.component';



//#endregion

//registra pt-br
registerLocaleData(localePt);

@NgModule(
{
	declarations: 
	[
		AppComponent,
		LoginComponent,
		LogoutComponent,
		TemplateAppComponent,
		TemplateLoginComponent,
		MenuComponent,
		UploadComponent,
		DashboardComponent,
		ConfiguracaoComponent,
		UsuarioListaComponent,
		UsuarioEditaComponent,
		ClienteListaComponent,
		ClienteEditaComponent,
		CaminhaoListaComponent,
		CaminhaoEditaComponent,
		MotoristaListaComponent,
		MotoristaEditaComponent,
		FormaPagamentoListaComponent,
		FormaPagamentoEditaComponent,
		PedidoListaComponent,
		PedidoEditaComponent,
		LancamentoListaComponent,
		LancamentoEditaComponent,
		UsuarioEditaSenhaComponent,
		AnexoUploadComponent,
		AnexoListaComponent,
		PedidoFinalizaComponent,
		LancamentoBaixaComponent,
		PedidoEntregaComponent,
		ReportLancamentoAbertoComponent,
		ReportLancamentoBaixadoComponent,
		ReportPedidoListaComponent,
		ReportPedidoDetalheComponent,
		TipoDocumentoListaComponent,
		TipoDocumentoEditaComponent,
		CentroCustoListaComponent,
		CentroCustoEditaComponent,
		ContaBancariaListaComponent,
		ContaBancariaEditaComponent,
		ProprietarioListaComponent,
		ProprietarioEditaComponent,
		RemetenteListaComponent,
		RemetenteEditaComponent,
		ReportLancamentoAgrupadoComponent,
		ReportExtratoComponent,
		EstoqueListaComponent,
		EstoqueEditaComponent,
		ReportEstoqueDevolucaoComponent,
		ReportEstoqueListaComponent,
		ReportEstoqueMovimentacaoComponent,
		ConciliacaoListaComponent,
		ConciliacaoEditaComponent
	],
	imports: 
	[
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		HttpClientModule,
		AppRoutingModule,
		PrimengBrUtilsModule.forRoot(),
		LocalStorageModule.forRoot({
            prefix: 'g3transportes',
            storageType: 'localStorage'
		}),

		BreadcrumbModule,
		ButtonModule,
		BlockUIModule,
		CalendarModule,
		CardModule,
		CheckboxModule,
		DialogModule,
		DynamicDialogModule,
		DropdownModule,
		FileUploadModule,
		InputTextModule,
		InputTextareaModule,
		InputMaskModule,
		InputSwitchModule,
		MenuModule,
		MenubarModule,
		MultiSelectModule,
		PanelModule,
		PaginatorModule,
		PasswordModule,
		ProgressBarModule,
		ProgressSpinnerModule,
		SplitButtonModule,
		StepsModule,
		TabViewModule,
		TableModule,
		ToolbarModule,
		TreeTableModule,
		TooltipModule,
		ToastModule
	],
	providers: 
	[
		{ provide: LOCALE_ID, useValue: 'pt-BR' },
		AnexoService,
		CaminhaoService,
		CaminhaoAnexoService,
		CentroCustoService,
		ClienteService,
		ClienteAnexoService,
		ConfiguracaoService,
		ContaBancariaService,
		DialogService,
		DialogServiceHelper,
		EstadoService,
		FormaPagamentoService,
		GlobalService,
		LancamentoService,
		LancamentoAnexoService,
		LancamentoBaixaService,
		MotoristaService,
		MotoristaAnexoService,
		PedidoService,
		PedidoAnexoService,
		ProprietarioService,
		ProprietarioAnexoService,
		RemetenteService,
		RemetenteAnexoService,
		RemetenteEstoqueService,
		TipoDocumentoService,
		UsuarioService
	],
	bootstrap: 
	[
		AppComponent
	]
})
export class AppModule { }