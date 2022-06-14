import { Injectable } from '@angular/core';
import { CommonHelper } from '../helpers/common.helper';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from './global.service';
import { CaminhaoFilter } from '../filters/caminhao.filter';
import { ListResult } from '../helpers/list-result.helper';
import { Caminhao } from '../models/caminhao.model';
import { ItemResult } from '../helpers/item-result.helper';

@Injectable({
	providedIn: 'root'
})
export class CaminhaoService 
{
	public endpoint: string = CommonHelper.apiHost('caminhao');
	
	constructor(public http: HttpClient, public globalService: GlobalService) 
	{ 
		
	}

	public async pegaLista(filter: CaminhaoFilter, pagina: number, tamanho: number): Promise<ListResult<Caminhao>>
	{
		let url = this.endpoint + "/lista/" + pagina + "/" + tamanho;

		return await this.http
						 .post<ListResult<Caminhao>>(url, filter)
						 .toPromise();
	}

	public async pegaItem(id: number): Promise<ItemResult<Caminhao>>
	{
		let url = this.endpoint + "/item/" + id;

		return await this.http
						 .get<ItemResult<Caminhao>>(url)
						 .toPromise();
	}

	public async insere(item: Caminhao): Promise<ItemResult<Caminhao>>
	{
		let url = this.endpoint + "/insere";

		return await this.http
						 .post<ItemResult<Caminhao>>(url, item)
						 .toPromise();
	}

	public async atualiza(item: Caminhao): Promise<ItemResult<Caminhao>>
	{
		let url = this.endpoint + "/atualiza";

		return await this.http
						 .put<ItemResult<Caminhao>>(url, item)
						 .toPromise();
	}

	public async deleta(id: number): Promise<ItemResult<Caminhao>>
	{
		let url = this.endpoint + "/deleta/" + id;

		return await this.http
						 .delete<ItemResult<Caminhao>>(url)
						 .toPromise();
	}
}
