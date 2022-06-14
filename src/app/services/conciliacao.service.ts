import { Injectable } from '@angular/core';
import { CommonHelper } from '../helpers/common.helper';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from './global.service';
import { ConciliacaoFilter } from '../filters/conciliacao.filter';
import { ListResult } from '../helpers/list-result.helper';
import { Conciliacao } from '../models/conciliacao.model';
import { ItemResult } from '../helpers/item-result.helper';

@Injectable({
	providedIn: 'root'
})
export class ConciliacaoService 
{
	public endpoint: string = CommonHelper.apiHost('conciliacao');
	
	constructor(public http: HttpClient, public globalService: GlobalService) 
	{ 
		
	}

	public async pegaLista(filter: ConciliacaoFilter, pagina: number, tamanho: number): Promise<ListResult<Conciliacao>>
	{
		let url = this.endpoint + "/lista/" + pagina + "/" + tamanho;

		return await this.http
						 .post<ListResult<Conciliacao>>(url, filter)
						 .toPromise();
	}

	public async pegaItem(id: number): Promise<ItemResult<Conciliacao>>
	{
		let url = this.endpoint + "/item/" + id;

		return await this.http
						 .get<ItemResult<Conciliacao>>(url)
						 .toPromise();
	}

	public async insere(item: Conciliacao): Promise<ItemResult<Conciliacao>>
	{
		let url = this.endpoint + "/insere";

		return await this.http
						 .post<ItemResult<Conciliacao>>(url, item)
						 .toPromise();
	}

	public async atualiza(item: Conciliacao): Promise<ItemResult<Conciliacao>>
	{
		let url = this.endpoint + "/atualiza";

		return await this.http
						 .put<ItemResult<Conciliacao>>(url, item)
						 .toPromise();
	}

	public async deleta(id: number): Promise<ItemResult<Conciliacao>>
	{
		let url = this.endpoint + "/deleta/" + id;

		return await this.http
						 .delete<ItemResult<Conciliacao>>(url)
						 .toPromise();
	}
}