import { Injectable } from '@angular/core';
import { CommonHelper } from '../helpers/common.helper';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from './global.service';
import { ListResult } from '../helpers/list-result.helper';
import { TipoDocumento } from '../models/tipo-documento.model';
import { ItemResult } from '../helpers/item-result.helper';

@Injectable({
	providedIn: 'root'
})
export class TipoDocumentoService 
{
	public endpoint: string = CommonHelper.apiHost('tipo-documento');
	
	constructor(public http: HttpClient, public globalService: GlobalService) 
	{ 
		
	}

	public async pegaLista(): Promise<ListResult<TipoDocumento>>
	{
		let url = this.endpoint + "/lista";

		return await this.http
						 .get<ListResult<TipoDocumento>>(url)
						 .toPromise();
	}

	public async pegaItem(id: number): Promise<ItemResult<TipoDocumento>>
	{
		let url = this.endpoint + "/item/" + id;

		return await this.http
						 .get<ItemResult<TipoDocumento>>(url)
						 .toPromise();
	}

	public async insere(item: TipoDocumento): Promise<ItemResult<TipoDocumento>>
	{
		let url = this.endpoint + "/insere";

		return await this.http
						 .post<ItemResult<TipoDocumento>>(url, item)
						 .toPromise();
	}

	public async atualiza(item: TipoDocumento): Promise<ItemResult<TipoDocumento>>
	{
		let url = this.endpoint + "/atualiza";

		return await this.http
						 .put<ItemResult<TipoDocumento>>(url, item)
						 .toPromise();
	}

	public async deleta(id: number): Promise<ItemResult<TipoDocumento>>
	{
		let url = this.endpoint + "/deleta/" + id;

		return await this.http
						 .delete<ItemResult<TipoDocumento>>(url)
						 .toPromise();
	}
}
