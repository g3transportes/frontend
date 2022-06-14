import { Injectable } from '@angular/core';
import { CommonHelper } from '../helpers/common.helper';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from './global.service';
import { ListResult } from '../helpers/list-result.helper';
import { CentroCusto } from '../models/centro-custo.model';
import { ItemResult } from '../helpers/item-result.helper';

@Injectable({
	providedIn: 'root'
})
export class CentroCustoService 
{
	public endpoint: string = CommonHelper.apiHost('centro-custo');
	
	constructor(public http: HttpClient, public globalService: GlobalService) 
	{ 
		
	}

	public async pegaLista(): Promise<ListResult<CentroCusto>>
	{
		let url = this.endpoint + "/lista";

		return await this.http
						 .get<ListResult<CentroCusto>>(url)
						 .toPromise();
	}

	public async pegaItem(id: number): Promise<ItemResult<CentroCusto>>
	{
		let url = this.endpoint + "/item/" + id;

		return await this.http
						 .get<ItemResult<CentroCusto>>(url)
						 .toPromise();
	}

	public async insere(item: CentroCusto): Promise<ItemResult<CentroCusto>>
	{
		let url = this.endpoint + "/insere";

		return await this.http
						 .post<ItemResult<CentroCusto>>(url, item)
						 .toPromise();
	}

	public async atualiza(item: CentroCusto): Promise<ItemResult<CentroCusto>>
	{
		let url = this.endpoint + "/atualiza";

		return await this.http
						 .put<ItemResult<CentroCusto>>(url, item)
						 .toPromise();
	}

	public async deleta(id: number): Promise<ItemResult<CentroCusto>>
	{
		let url = this.endpoint + "/deleta/" + id;

		return await this.http
						 .delete<ItemResult<CentroCusto>>(url)
						 .toPromise();
	}
}
