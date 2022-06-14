import { Injectable } from '@angular/core';
import { CommonHelper } from '../helpers/common.helper';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from './global.service';
import { LancamentoFilter } from '../filters/lancamento.filter';
import { ListResult } from '../helpers/list-result.helper';
import { Lancamento } from '../models/lancamento.model';
import { ItemResult } from '../helpers/item-result.helper';
import { LancamentoResumo } from '../viewmodels/lancamento-resumo.model';

@Injectable({
	providedIn: 'root'
})
export class LancamentoService
{
	public endpoint: string = CommonHelper.apiHost('lancamento');

	constructor(public http: HttpClient, public globalService: GlobalService)
	{

	}
	// public async pegaListaCompleta(filter: LancamentoFilter, formapagamento: number, ): Promise<ListResult<Lancamento>>
	// {
	// 	// let url = this.endpoint + "/lista/";
	// 	let url = "http://localhost:44320/forma-pagamento/listacompleta/";

	// 	return await this.http
	// 					 .post<ListResult<Lancamento>>(url, filter)
	// 					 .toPromise();
	// }


	public async pegaLista(filter: LancamentoFilter, pagina: number, tamanho: number): Promise<ListResult<Lancamento>>
	{
		let url = this.endpoint + "/lista/" + pagina + "/" + tamanho;

		return await this.http
						 .post<ListResult<Lancamento>>(url, filter)
						 .toPromise();
	}

	public async pegaListaCompleta(filter: LancamentoFilter): Promise<ListResult<Lancamento>>
	{
		let url = this.endpoint + "/lista/";

		return await this.http
						 .post<ListResult<Lancamento>>(url, filter)
						 .toPromise();
	}

	public async pegaItem(id: number): Promise<ItemResult<Lancamento>>
	{
		let url = this.endpoint + "/item/" + id;

		return await this.http
						 .get<ItemResult<Lancamento>>(url)
						 .toPromise();
	}

	public async pegaResumoCliente(filter: LancamentoFilter): Promise<ListResult<LancamentoResumo>>
	{
		let url = this.endpoint + "/resumo/cliente";

		return await this.http
						 .post<ListResult<LancamentoResumo>>(url, filter)
						 .toPromise();
	}

	public async pegaResumoCaminhao(filter: LancamentoFilter): Promise<ListResult<LancamentoResumo>>
	{
		let url = this.endpoint + "/resumo/caminhao";

		return await this.http
						 .post<ListResult<LancamentoResumo>>(url, filter)
						 .toPromise();
	}

	public async pegaResumoProprietario(filter: LancamentoFilter): Promise<ListResult<LancamentoResumo>>
	{
		let url = this.endpoint + "/resumo/proprietario";

		return await this.http
						 .post<ListResult<LancamentoResumo>>(url, filter)
						 .toPromise();
	}

	public async pegaResumoCentroCusto(filter: LancamentoFilter): Promise<ListResult<LancamentoResumo>>
	{
		let url = this.endpoint + "/resumo/centro-custo";

		return await this.http
						 .post<ListResult<LancamentoResumo>>(url, filter)
						 .toPromise();
	}

	public async insere(item: Lancamento): Promise<ItemResult<Lancamento>>
	{
		let url = this.endpoint + "/insere";

		return await this.http
						 .post<ItemResult<Lancamento>>(url, item)
						 .toPromise();
	}

	public async atualiza(item: Lancamento): Promise<ItemResult<Lancamento>>
	{
		let url = this.endpoint + "/atualiza";

		return await this.http
						 .put<ItemResult<Lancamento>>(url, item)
						 .toPromise();
	}

	public async baixa(item: Lancamento): Promise<ItemResult<Lancamento>>
	{
		let url = this.endpoint + "/baixa";

		return await this.http
						 .put<ItemResult<Lancamento>>(url, item)
						 .toPromise();
	}

	public async estorna(item: Lancamento): Promise<ItemResult<Lancamento>>
	{
		let url = this.endpoint + "/estorna";

		return await this.http
						 .put<ItemResult<Lancamento>>(url, item)
						 .toPromise();
	}

	public async deleta(id: number): Promise<ItemResult<Lancamento>>
	{
		let url = this.endpoint + "/deleta/" + id;

		return await this.http
						 .delete<ItemResult<Lancamento>>(url)
						 .toPromise();
	}

	// handleFile(vm:ListResult<LancamentoResumo>, nome:string){


	// 	let posicoes = vm.Items
	// 	let result = []


	// 	posicoes.forEach(item => {

	// 		result.push([ item.cpfIsp, item.local, item.dataHora ])

	// 	});

	// 	result.splice(0, 0, [ 'Cpf', 'Local', 'DataHora'])

	// 	const ws = XLSX.utils.aoa_to_sheet(result)

	// 	if (!ws['!merges']) ws['!merges'] = []

	// 	const wb = XLSX.utils.book_new()

	// 	XLSX.utils.book_append_sheet(wb, ws, 'Últimas Posições')

	// 	XLSX.writeFile(wb, 'Consulta_PessoasIsp_UltimasPosicoes.csv')

	// }

	}
