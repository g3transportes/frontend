import { Injectable } from '@angular/core';
import { CommonHelper } from '../helpers/common.helper';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from './global.service';
import { PedidoAnexoFilter } from '../filters/pedido-anexo.filter';
import { ListResult } from '../helpers/list-result.helper';
import { PedidoAnexo } from '../models/pedido-anexo.model';
import { ItemResult } from '../helpers/item-result.helper';

@Injectable({
	providedIn: 'root'
})
export class PedidoAnexoService 
{
	public endpoint: string = CommonHelper.apiHost('pedido-anexo');
	
	constructor(public http: HttpClient, public globalService: GlobalService) 
	{ 
		
	}

	public async pegaLista(filter: PedidoAnexoFilter, pagina: number, tamanho: number): Promise<ListResult<PedidoAnexo>>
	{
		let url = this.endpoint + "/lista/" + pagina + "/" + tamanho;

		return await this.http
						 .post<ListResult<PedidoAnexo>>(url, filter)
						 .toPromise();
	}

	public async pegaItem(idPedido: number, idAnexo: number): Promise<ItemResult<PedidoAnexo>>
	{
		let url = this.endpoint + "/item/pedido/" + idPedido + "/anexo/" + idAnexo;

		return await this.http
						 .get<ItemResult<PedidoAnexo>>(url)
						 .toPromise();
	}

	public async insere(item: PedidoAnexo): Promise<ItemResult<PedidoAnexo>>
	{
		let url = this.endpoint + "/insere";

		return await this.http
						 .post<ItemResult<PedidoAnexo>>(url, item)
						 .toPromise();
	}

	public async insereVarios(lista: Array<PedidoAnexo>): Promise<ListResult<PedidoAnexo>>
	{
		let url = this.endpoint + "/insere/varios";

		return await this.http
						 .post<ListResult<PedidoAnexo>>(url, lista)
						 .toPromise();
	}

	public async atualiza(item: PedidoAnexo): Promise<ItemResult<PedidoAnexo>>
	{
		let url = this.endpoint + "/atualiza";

		return await this.http
						 .put<ItemResult<PedidoAnexo>>(url, item)
						 .toPromise();
	}

	public async deleta(idPedido: number, idAnexo: number): Promise<ItemResult<PedidoAnexo>>
	{
		let url = this.endpoint + "/deleta/pedido/" + idPedido + "/anexo/" + idAnexo;

		return await this.http
						 .delete<ItemResult<PedidoAnexo>>(url)
						 .toPromise();
	}
}