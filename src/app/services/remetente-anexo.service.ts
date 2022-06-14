import { Injectable } from '@angular/core';
import { CommonHelper } from '../helpers/common.helper';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from './global.service';
import { RemetenteAnexoFilter } from '../filters/remetente-anexo.filter';
import { ListResult } from '../helpers/list-result.helper';
import { RemetenteAnexo } from '../models/remetente-anexo.model';
import { ItemResult } from '../helpers/item-result.helper';

@Injectable({
	providedIn: 'root'
})
export class RemetenteAnexoService 
{
	public endpoint: string = CommonHelper.apiHost('remetente-anexo');
	
	constructor(public http: HttpClient, public globalService: GlobalService) 
	{ 
		
	}

	public async pegaLista(filter: RemetenteAnexoFilter, pagina: number, tamanho: number): Promise<ListResult<RemetenteAnexo>>
	{
		let url = this.endpoint + "/lista/" + pagina + "/" + tamanho;

		return await this.http
						 .post<ListResult<RemetenteAnexo>>(url, filter)
						 .toPromise();
	}

	public async pegaItem(idRemetente: number, idAnexo: number): Promise<ItemResult<RemetenteAnexo>>
	{
		let url = this.endpoint + "/item/remetente/" + idRemetente + "/anexo/" + idAnexo;

		return await this.http
						 .get<ItemResult<RemetenteAnexo>>(url)
						 .toPromise();
	}

	public async insere(item: RemetenteAnexo): Promise<ItemResult<RemetenteAnexo>>
	{
		let url = this.endpoint + "/insere";

		return await this.http
						 .post<ItemResult<RemetenteAnexo>>(url, item)
						 .toPromise();
	}

	public async insereVarios(lista: Array<RemetenteAnexo>): Promise<ListResult<RemetenteAnexo>>
	{
		let url = this.endpoint + "/insere/varios";

		return await this.http
						 .post<ListResult<RemetenteAnexo>>(url, lista)
						 .toPromise();
	}

	public async atualiza(item: RemetenteAnexo): Promise<ItemResult<RemetenteAnexo>>
	{
		let url = this.endpoint + "/atualiza";

		return await this.http
						 .put<ItemResult<RemetenteAnexo>>(url, item)
						 .toPromise();
	}

	public async deleta(idRemetente: number, idAnexo: number): Promise<ItemResult<RemetenteAnexo>>
	{
		let url = this.endpoint + "/deleta/remetente/" + idRemetente + "/anexo/" + idAnexo;

		return await this.http
						 .delete<ItemResult<RemetenteAnexo>>(url)
						 .toPromise();
	}
}