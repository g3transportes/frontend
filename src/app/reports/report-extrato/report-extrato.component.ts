import { Component, OnInit, Input } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { ExtratoFiltro, Extrato } from 'src/app/viewmodels/extrato.model';
import { ListResult } from 'src/app/helpers/list-result.helper';
import { SelectItem } from 'primeng/api';
import { Loading } from 'src/app/helpers/loading.helper';
import { GlobalService } from 'src/app/services/global.service';
import { ContaBancariaService } from 'src/app/services/conta-bancaria.service';
import { DialogServiceHelper } from 'src/app/services/dialog.service';
import { CommonHelper } from 'src/app/helpers/common.helper';
import { DialogTypeEnum } from 'src/app/enums/dialog-type.enum';
import * as XLSX from 'xlsx';
import { Cliente } from './../../models/cliente.model';


@Component({
	selector: 'app-report-extrato',
	templateUrl: './report-extrato.component.html',
	styleUrls: ['./report-extrato.component.css'],
	providers: [ DialogService ]
})
export class ReportExtratoComponent implements OnInit
{
	@Input() public filtro: ExtratoFiltro;
	public vm : ListResult<Extrato> = new ListResult<Extrato>();
	public contasBancarias: SelectItem[];
	public loading: Loading = new Loading();
	public localeBR: any;
	public showReport: boolean = false;

	constructor(public globalService: GlobalService,
		private contaBancariaService: ContaBancariaService,
		private modalService: DialogService,
		private dialogService: DialogServiceHelper)
	{

	}

	ngOnInit(): void
	{
		this.inicializa()
	}

	private inicializa(): void
	{
		this.globalService.verificaLogado();
		this.localeBR = CommonHelper.calendarLocale();

		//verifica filtro
		if(this.filtro == null)
			this.filtro = new ExtratoFiltro();

		this.carregaBreadcrumb();
		this.carregaContasBancarias();
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
				label: 'Relatórios'
			},
			{
				label: 'Extrato Financeiro'
			}
		];
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
					this.contasBancarias.push({ label: 'Todos os registros', value: null });

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

	private carregaLista(): void
	{
		//inicializa o loading
		this.loading.Status = true;

		//executa consulta
		this.contaBancariaService
			.extrato(this.filtro)
			.then((result) =>
			{
				if(result.IsValid)
				{
					this.vm = result;
					console.log(this.vm);
				}
				else
				{
					this.dialogService.alert('Erro ao carregar os dados1', result.Errors, DialogTypeEnum.Erro, null);
				}
			})
			.catch((error) =>
			{
				this.dialogService.alert('Erro ao carregar os dados2', [ error ], DialogTypeEnum.Erro, null);
			})
			.finally(() =>
			{
				this.loading.Status = false;
				this.showReport = true;
			});
	}

	public trataDownload(){


		let extrato = [];
		extrato = this.vm.Items;

		var wb: XLSX.WorkBook = XLSX.utils.book_new();

		//receber
		if(extrato != null && extrato.length > 0){

			const snReceber: string = "Extrato Bancário";
			let aoaReceber: any[][] = [];
			let aoaTeste: any[][] = [];
			let merge = []

			//Fornecedor

			extrato.forEach(cliente => {

				aoaReceber.push([cliente.Conta])
				merge.push({s:{r:aoaReceber.length - 1, c:0}, e:{r:aoaReceber.length - 1, c:1}})
				aoaReceber.push(["Saldo Anterior", "Créditos", "Débitos","Saldo Atual", "Créditos em Aberto", "Débitos em Aberto",
							  "Saldo Previsto"])

						aoaReceber.push([this.valor(cliente.SaldoAnterior), this.valor(cliente.CreditoBaixado), this.valor(cliente.DebitoBaixado),
							this.valor(cliente.Saldo), this.valor(cliente.CreditoAberto), this.valor(cliente.DebitoAberto), this.valor(cliente.DebitoAberto)])

							if(cliente.Debitos.length > 0){
								aoaReceber.push([""]);
								aoaReceber.push(["Débitos"])
								aoaReceber.push([""]);
								aoaReceber.push(["Tipo", "Vencimemnto", "Baixa", "Pedido", "Fornecedor", "Caminhão", "Forma Pgto", "Valor"])

								cliente.Debitos.forEach(debito=> {
									aoaReceber.push([debito.Tipo, this.formataData(debito.Vencimento), this.formataData(debito.Baixa), debito.OrdemServico,
									debito.Cliente, debito.Motorista, debito.FormaPagamento, this.valor(debito.ValorBaixado)])
								});
						}
						if(cliente.Creditos.length > 0){
							aoaReceber.push([""]);
								aoaReceber.push(["Créditos"])
								aoaReceber.push([""]);

							aoaReceber.push(["Tipo", "Vencimemnto", "Baixa", "Pedido", "Fornecedor", "Caminhão", "Forma Pgto", "Valor"])

								cliente.Creditos.forEach(item => {
									aoaReceber.push([item.Tipo, this.formataData(item.Vencimento), this.formataData(item.Baixa), item.OrdemServico,
									item.Fornecedor, item.Motorista, item.FormaPagamento, this.valor(item.ValorBaixado)])
								});
						}

				aoaReceber.push([""]);
			});

			var ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoaReceber);
			XLSX.utils.book_append_sheet(wb, ws, snReceber);

			var wscols = [
				{wch:30},
				{wch:30},
				{wch:30},
				{wch:30},
				{wch:30},
				{wch:30},
				{wch:30},
				{wch:30},
				{wch:30},
				{wch:30},
				{wch:30}
			];

			ws['!cols'] = wscols;
			ws['!merges'] = merge;
		}else{

			alert("Sem dados a serem impressos!");
		}

		XLSX.writeFile(wb, 'report.xlsx');
	}

	private formataData(data: string){

		let dataConvertida = new Date(data)

		if(data != null ){

		let dataFormatada = ((dataConvertida.getDate() )) + "/" + ((dataConvertida.getMonth() + 1)) + "/" + dataConvertida.getFullYear();

		return dataFormatada;
		}

	}

	private valor(valor:number){

	if(valor !=null){

	var valorFormatado = valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

	}
	return valorFormatado;

	}

	public onGerar_Click(): void
	{
		this.carregaLista();
	}

	public onExportXls_Click(){

		this.trataDownload();
	}
}
