import { Injectable } from '@angular/core';
import { CommonHelper } from '../helpers/common.helper';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from './global.service';
import { MotoristaFilter } from '../filters/motorista.filter';
import { ListResult } from '../helpers/list-result.helper';
import { Motorista } from '../models/motorista.model';
import { ItemResult } from '../helpers/item-result.helper';

@Injectable({
	providedIn: 'root'
})
export class MotoristaService 
{
	public endpoint: string = CommonHelper.apiHost('motorista');
	
	constructor(public http: HttpClient, public globalService: GlobalService) 
	{ 
		
	}

	public async pegaLista(filter: MotoristaFilter, pagina: number, tamanho: number): Promise<ListResult<Motorista>>
	{
		let url = this.endpoint + "/lista/" + pagina + "/" + tamanho;

		return await this.http
						 .post<ListResult<Motorista>>(url, filter)
						 .toPromise();
	}

	public async pegaItem(id: number): Promise<ItemResult<Motorista>>
	{
		let url = this.endpoint + "/item/" + id;

		return await this.http
						 .get<ItemResult<Motorista>>(url)
						 .toPromise();
	}

	public async insere(item: Motorista): Promise<ItemResult<Motorista>>
	{
		let url = this.endpoint + "/insere";

		return await this.http
						 .post<ItemResult<Motorista>>(url, item)
						 .toPromise();
	}

	public async atualiza(item: Motorista): Promise<ItemResult<Motorista>>
	{
		let url = this.endpoint + "/atualiza";

		return await this.http
						 .put<ItemResult<Motorista>>(url, item)
						 .toPromise();
	}

	public async deleta(id: number): Promise<ItemResult<Motorista>>
	{
		let url = this.endpoint + "/deleta/" + id;

		return await this.http
						 .delete<ItemResult<Motorista>>(url)
						 .toPromise();
	}
}
