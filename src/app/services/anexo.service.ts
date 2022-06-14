import { Injectable } from '@angular/core';
import { CommonHelper } from '../helpers/common.helper';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from './global.service';
import { AnexoFilter } from '../filters/anexo.filter';
import { ListResult } from '../helpers/list-result.helper';
import { Anexo } from '../models/anexo.model';
import { ItemResult } from '../helpers/item-result.helper';

@Injectable({
	providedIn: 'root'
})
export class AnexoService 
{
	public endpoint: string = CommonHelper.apiHost('anexo');
	
	constructor(public http: HttpClient, public globalService: GlobalService) 
	{ 
		
	}

	public async pegaLista(filter: AnexoFilter, pagina: number, tamanho: number): Promise<ListResult<Anexo>>
	{
		let url = this.endpoint + "/lista/" + pagina + "/" + tamanho;

		return await this.http
						 .post<ListResult<Anexo>>(url, filter)
						 .toPromise();
	}

	public async pegaItem(id: number): Promise<ItemResult<Anexo>>
	{
		let url = this.endpoint + "/item/" + id;

		return await this.http
						 .get<ItemResult<Anexo>>(url)
						 .toPromise();
	}

	public async insere(item: Anexo): Promise<ItemResult<Anexo>>
	{
		let url = this.endpoint + "/insere";

		return await this.http
						 .post<ItemResult<Anexo>>(url, item)
						 .toPromise();
	}

	public async atualiza(item: Anexo): Promise<ItemResult<Anexo>>
	{
		let url = this.endpoint + "/atualiza";

		return await this.http
						 .put<ItemResult<Anexo>>(url, item)
						 .toPromise();
	}

	public async deleta(id: number): Promise<ItemResult<Anexo>>
	{
		let url = this.endpoint + "/deleta/" + id;

		return await this.http
						 .delete<ItemResult<Anexo>>(url)
						 .toPromise();
	}
}
