import { Injectable } from '@angular/core';
import { CommonHelper } from '../helpers/common.helper';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from './global.service';
import { LancamentoAnexoFilter } from '../filters/lancamento-anexo.filter';
import { ListResult } from '../helpers/list-result.helper';
import { LancamentoAnexo } from '../models/lancamento-anexo.model';
import { ItemResult } from '../helpers/item-result.helper';

@Injectable({
	providedIn: 'root'
})
export class LancamentoAnexoService 
{
	public endpoint: string = CommonHelper.apiHost('lancamento-anexo');
	
	constructor(public http: HttpClient, public globalService: GlobalService) 
	{ 
		
	}

	public async pegaLista(filter: LancamentoAnexoFilter, pagina: number, tamanho: number): Promise<ListResult<LancamentoAnexo>>
	{
		let url = this.endpoint + "/lista/" + pagina + "/" + tamanho;

		return await this.http
						 .post<ListResult<LancamentoAnexo>>(url, filter)
						 .toPromise();
	}

	public async pegaItem(idLancamento: number, idAnexo: number): Promise<ItemResult<LancamentoAnexo>>
	{
		let url = this.endpoint + "/item/lancamento/" + idLancamento + "/anexo/" + idAnexo;

		return await this.http
						 .get<ItemResult<LancamentoAnexo>>(url)
						 .toPromise();
	}

	public async insere(item: LancamentoAnexo): Promise<ItemResult<LancamentoAnexo>>
	{
		let url = this.endpoint + "/insere";

		return await this.http
						 .post<ItemResult<LancamentoAnexo>>(url, item)
						 .toPromise();
	}

	public async insereVarios(lista: Array<LancamentoAnexo>): Promise<ListResult<LancamentoAnexo>>
	{
		let url = this.endpoint + "/insere/varios";

		return await this.http
						 .post<ListResult<LancamentoAnexo>>(url, lista)
						 .toPromise();
	}

	public async atualiza(item: LancamentoAnexo): Promise<ItemResult<LancamentoAnexo>>
	{
		let url = this.endpoint + "/atualiza";

		return await this.http
						 .put<ItemResult<LancamentoAnexo>>(url, item)
						 .toPromise();
	}

	public async deleta(idLancamento: number, idAnexo: number): Promise<ItemResult<LancamentoAnexo>>
	{
		let url = this.endpoint + "/deleta/lancamento/" + idLancamento + "/anexo/" + idAnexo;

		return await this.http
						 .delete<ItemResult<LancamentoAnexo>>(url)
						 .toPromise();
	}
}