import { Injectable } from '@angular/core';
import { CommonHelper } from '../helpers/common.helper';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from './global.service';
import { ProprietarioFilter } from '../filters/proprietario.filter';
import { ListResult } from '../helpers/list-result.helper';
import { Proprietario } from '../models/proprietario.model';
import { ItemResult } from '../helpers/item-result.helper';

@Injectable({
	providedIn: 'root'
})
export class ProprietarioService 
{
	public endpoint: string = CommonHelper.apiHost('proprietario');
	
	constructor(public http: HttpClient, public globalService: GlobalService) 
	{ 
		
	}

	public async pegaLista(filter: ProprietarioFilter, pagina: number, tamanho: number): Promise<ListResult<Proprietario>>
	{
		let url = this.endpoint + "/lista/" + pagina + "/" + tamanho;

		return await this.http
						 .post<ListResult<Proprietario>>(url, filter)
						 .toPromise();
	}

	public async pegaItem(id: number): Promise<ItemResult<Proprietario>>
	{
		let url = this.endpoint + "/item/" + id;

		return await this.http
						 .get<ItemResult<Proprietario>>(url)
						 .toPromise();
	}

	public async insere(item: Proprietario): Promise<ItemResult<Proprietario>>
	{
		let url = this.endpoint + "/insere";

		return await this.http
						 .post<ItemResult<Proprietario>>(url, item)
						 .toPromise();
	}

	public async atualiza(item: Proprietario): Promise<ItemResult<Proprietario>>
	{
		let url = this.endpoint + "/atualiza";

		return await this.http
						 .put<ItemResult<Proprietario>>(url, item)
						 .toPromise();
	}

	public async deleta(id: number): Promise<ItemResult<Proprietario>>
	{
		let url = this.endpoint + "/deleta/" + id;

		return await this.http
						 .delete<ItemResult<Proprietario>>(url)
						 .toPromise();
	}
}