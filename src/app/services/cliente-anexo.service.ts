import { Injectable } from '@angular/core';
import { CommonHelper } from '../helpers/common.helper';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from './global.service';
import { ClienteAnexoFilter } from '../filters/cliente-anexo.filter';
import { ListResult } from '../helpers/list-result.helper';
import { ClienteAnexo } from '../models/cliente-anexo.model';
import { ItemResult } from '../helpers/item-result.helper';

@Injectable({
	providedIn: 'root'
})
export class ClienteAnexoService 
{
	public endpoint: string = CommonHelper.apiHost('cliente-anexo');
	
	constructor(public http: HttpClient, public globalService: GlobalService) 
	{ 
		
	}

	public async pegaLista(filter: ClienteAnexoFilter, pagina: number, tamanho: number): Promise<ListResult<ClienteAnexo>>
	{
		let url = this.endpoint + "/lista/" + pagina + "/" + tamanho;

		return await this.http
						 .post<ListResult<ClienteAnexo>>(url, filter)
						 .toPromise();
	}

	public async pegaItem(idCliente: number, idAnexo: number): Promise<ItemResult<ClienteAnexo>>
	{
		let url = this.endpoint + "/item/cliente/" + idCliente + "/anexo/" + idAnexo;

		return await this.http
						 .get<ItemResult<ClienteAnexo>>(url)
						 .toPromise();
	}

	public async insere(item: ClienteAnexo): Promise<ItemResult<ClienteAnexo>>
	{
		let url = this.endpoint + "/insere";

		return await this.http
						 .post<ItemResult<ClienteAnexo>>(url, item)
						 .toPromise();
	}

	public async insereVarios(lista: Array<ClienteAnexo>): Promise<ListResult<ClienteAnexo>>
	{
		let url = this.endpoint + "/insere/varios";

		return await this.http
						 .post<ListResult<ClienteAnexo>>(url, lista)
						 .toPromise();
	}

	public async atualiza(item: ClienteAnexo): Promise<ItemResult<ClienteAnexo>>
	{
		let url = this.endpoint + "/atualiza";

		return await this.http
						 .put<ItemResult<ClienteAnexo>>(url, item)
						 .toPromise();
	}

	public async deleta(idCliente: number, idAnexo: number): Promise<ItemResult<ClienteAnexo>>
	{
		let url = this.endpoint + "/deleta/cliente/" + idCliente + "/anexo/" + idAnexo;

		return await this.http
						 .delete<ItemResult<ClienteAnexo>>(url)
						 .toPromise();
	}
}