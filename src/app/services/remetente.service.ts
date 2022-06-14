import { Injectable } from '@angular/core';
import { CommonHelper } from '../helpers/common.helper';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from './global.service';
import { RemetenteFilter } from '../filters/remetente.filter';
import { ListResult } from '../helpers/list-result.helper';
import { Remetente } from '../models/remetente.model';
import { ItemResult } from '../helpers/item-result.helper';

@Injectable({
	providedIn: 'root'
})
export class RemetenteService 
{
	public endpoint: string = CommonHelper.apiHost('remetente');
	
	constructor(public http: HttpClient, public globalService: GlobalService) 
	{ 
		
	}

	public async pegaLista(filter: RemetenteFilter, pagina: number, tamanho: number): Promise<ListResult<Remetente>>
	{
		let url = this.endpoint + "/lista/" + pagina + "/" + tamanho;

		return await this.http
						 .post<ListResult<Remetente>>(url, filter)
						 .toPromise();
	}

	public async pegaItem(id: number): Promise<ItemResult<Remetente>>
	{
		let url = this.endpoint + "/item/" + id;

		return await this.http
						 .get<ItemResult<Remetente>>(url)
						 .toPromise();
	}

	public async insere(item: Remetente): Promise<ItemResult<Remetente>>
	{
		let url = this.endpoint + "/insere";

		return await this.http
						 .post<ItemResult<Remetente>>(url, item)
						 .toPromise();
	}

	public async atualiza(item: Remetente): Promise<ItemResult<Remetente>>
	{
		let url = this.endpoint + "/atualiza";

		return await this.http
						 .put<ItemResult<Remetente>>(url, item)
						 .toPromise();
	}

	public async deleta(id: number): Promise<ItemResult<Remetente>>
	{
		let url = this.endpoint + "/deleta/" + id;

		return await this.http
						 .delete<ItemResult<Remetente>>(url)
						 .toPromise();
	}
}