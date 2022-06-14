import { Injectable } from '@angular/core';
import { CommonHelper } from '../helpers/common.helper';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from './global.service';
import { PedidoFilter } from '../filters/pedido.filter';
import { ListResult } from '../helpers/list-result.helper';
import { Pedido } from '../models/pedido.model';
import { ItemResult } from '../helpers/item-result.helper';
import { FinalizaPedido } from '../helpers/finaliza-pedido.helper';

@Injectable({
	providedIn: 'root'
})
export class PedidoService 
{
	public endpoint: string = CommonHelper.apiHost('pedido');
	
	constructor(public http: HttpClient, public globalService: GlobalService) 
	{ 
		
	}

	public async pegaLista(filter: PedidoFilter, pagina: number, tamanho: number): Promise<ListResult<Pedido>>
	{
		let url = this.endpoint + "/lista/" + pagina + "/" + tamanho;

		return await this.http
						 .post<ListResult<Pedido>>(url, filter)
						 .toPromise();
	}

	public async pegaItem(id: number): Promise<ItemResult<Pedido>>
	{
		let url = this.endpoint + "/item/" + id;

		return await this.http
						 .get<ItemResult<Pedido>>(url)
						 .toPromise();
	}

	public async ordemServico(item: Pedido): Promise<ItemResult<string>>
	{
		let url = this.endpoint + "/ordemservico";

		return await this.http
						 .post<ItemResult<string>>(url, item)
						 .toPromise();
	}
	
	public async insere(item: Pedido): Promise<ItemResult<Pedido>>
	{
		let url = this.endpoint + "/insere";

		return await this.http
						 .post<ItemResult<Pedido>>(url, item)
						 .toPromise();
	}

	public async atualiza(item: Pedido): Promise<ItemResult<Pedido>>
	{
		let url = this.endpoint + "/atualiza";

		return await this.http
						 .put<ItemResult<Pedido>>(url, item)
						 .toPromise();
	}

	public async entrega(item: Pedido): Promise<ItemResult<Pedido>>
	{
		let url = this.endpoint + "/entrega";

		return await this.http
						 .put<ItemResult<Pedido>>(url, item)
						 .toPromise();
	}

	public async estorna(item: Pedido): Promise<ItemResult<Pedido>>
	{
		let url = this.endpoint + "/estorna";

		return await this.http
						 .put<ItemResult<Pedido>>(url, item)
						 .toPromise();
	}

	public async paga(item: Pedido): Promise<ItemResult<Pedido>>
	{
		let url = this.endpoint + "/paga";

		return await this.http
						 .put<ItemResult<Pedido>>(url, item)
						 .toPromise();
	}

	public async devolve(item: Pedido): Promise<ItemResult<Pedido>>
	{
		let url = this.endpoint + "/devolve";

		return await this.http
						 .put<ItemResult<Pedido>>(url, item)
						 .toPromise();
	}

	public async estornaDevolucao(item: Pedido): Promise<ItemResult<Pedido>>
	{
		let url = this.endpoint + "/estorna/devolucao";

		return await this.http
						 .put<ItemResult<Pedido>>(url, item)
						 .toPromise();
	}

	public async deleta(id: number): Promise<ItemResult<Pedido>>
	{
		let url = this.endpoint + "/deleta/" + id;

		return await this.http
						 .delete<ItemResult<Pedido>>(url)
						 .toPromise();
	}

	public async finaliza(item: FinalizaPedido): Promise<ItemResult<Pedido>>
	{
		let url = this.endpoint + "/finaliza";

		return await this.http
						 .post<ItemResult<Pedido>>(url, item)
						 .toPromise();
	}

	public async exporta(filter: PedidoFilter): Promise<ItemResult<string>>
	{
		let url = this.endpoint + "/exporta";

		return await this.http
						 .post<ItemResult<string>>(url, filter)
						 .toPromise();
	}
}