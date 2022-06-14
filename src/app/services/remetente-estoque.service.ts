import { Injectable } from '@angular/core';
import { CommonHelper } from '../helpers/common.helper';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from './global.service';
import { RemetenteEstoqueFilter } from '../filters/remetente-estoque.filter';
import { ListResult } from '../helpers/list-result.helper';
import { RemetenteEstoque } from '../models/remetente-estoque.model';
import { ItemResult } from '../helpers/item-result.helper';
import { Estoque } from '../viewmodels/estoque.model';

@Injectable({
	providedIn: 'root'
})
export class RemetenteEstoqueService 
{
	public endpoint: string = CommonHelper.apiHost('remetente-estoque');
	
	constructor(public http: HttpClient, public globalService: GlobalService) 
	{ 
		
	}

	public async pegaLista(filter: RemetenteEstoqueFilter, pagina: number, tamanho: number): Promise<ListResult<RemetenteEstoque>>
	{
		let url = this.endpoint + "/lista/" + pagina + "/" + tamanho;

		return await this.http
						 .post<ListResult<RemetenteEstoque>>(url, filter)
						 .toPromise();
	}

	public async pegaItem(id: number): Promise<ItemResult<RemetenteEstoque>>
	{
		let url = this.endpoint + "/item/" + id;

		return await this.http
						 .get<ItemResult<RemetenteEstoque>>(url)
						 .toPromise();
	}

	public async insere(item: RemetenteEstoque): Promise<ItemResult<RemetenteEstoque>>
	{
		let url = this.endpoint + "/insere";

		return await this.http
						 .post<ItemResult<RemetenteEstoque>>(url, item)
						 .toPromise();
	}

	public async atualiza(item: RemetenteEstoque): Promise<ItemResult<RemetenteEstoque>>
	{
		let url = this.endpoint + "/atualiza";

		return await this.http
						 .put<ItemResult<RemetenteEstoque>>(url, item)
						 .toPromise();
	}

	public async deleta(id: number): Promise<ItemResult<RemetenteEstoque>>
	{
		let url = this.endpoint + "/deleta/" + id;

		return await this.http
						 .delete<ItemResult<RemetenteEstoque>>(url)
						 .toPromise();
	}

	public async relatorioEstoque(filtro: RemetenteEstoqueFilter): Promise<ItemResult<Estoque>>
	{
		let url = this.endpoint + "/relatorio/estoque";

		return await this.http
						 .post<ItemResult<Estoque>>(url, filtro)
						 .toPromise();
	}
}