import { Injectable } from '@angular/core';
import { CommonHelper } from '../helpers/common.helper';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from './global.service';
import { ClienteFilter } from '../filters/cliente.filter';
import { ListResult } from '../helpers/list-result.helper';
import { Cliente } from '../models/cliente.model';
import { ItemResult } from '../helpers/item-result.helper';

@Injectable({
	providedIn: 'root'
})
export class ClienteService
{
	public endpoint: string = CommonHelper.apiHost('cliente');

	constructor(public http: HttpClient, public globalService: GlobalService)
	{

	}

	public async pegaLista(filter: ClienteFilter, pagina: number, tamanho: number): Promise<ListResult<Cliente>>
	{
		let url = this.endpoint + "/lista/" + pagina + "/" + tamanho;

		return await this.http
						 .post<ListResult<Cliente>>(url, filter)
						 .toPromise();
	}

	public async pegaItem(id: number): Promise<ItemResult<Cliente>>
	{
		let url = this.endpoint + "/item/" + id;

		return await this.http
						 .get<ItemResult<Cliente>>(url)
						 .toPromise();
	}

	public async insere(item: Cliente): Promise<ItemResult<Cliente>>
	{
		let url = this.endpoint + "/insere";

		return this.http
						 .post<ItemResult<Cliente>>(url, item)
						 .toPromise();
	}

	public async atualiza(item: Cliente): Promise<ItemResult<Cliente>>
	{
		let url = this.endpoint + "/atualiza";

		return await this.http
						 .put<ItemResult<Cliente>>(url, item)
						 .toPromise();
	}

	public async deleta(id: number): Promise<ItemResult<Cliente>>
	{
		let url = this.endpoint + "/deleta/" + id;

		return await this.http
						 .delete<ItemResult<Cliente>>(url)
						 .toPromise();
	}



}
