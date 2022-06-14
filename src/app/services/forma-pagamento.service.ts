import { Injectable } from '@angular/core';
import { CommonHelper } from '../helpers/common.helper';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from './global.service';
import { ListResult } from '../helpers/list-result.helper';
import { FormaPagamento } from '../models/forma-pagamento.model';
import { ItemResult } from '../helpers/item-result.helper';

@Injectable({
	providedIn: 'root'
})
export class FormaPagamentoService 
{
	public endpoint: string = CommonHelper.apiHost('forma-pagamento');
	
	constructor(public http: HttpClient, public globalService: GlobalService) 
	{ 
		
	}

	public async pegaLista(): Promise<ListResult<FormaPagamento>>
	{
		let url = this.endpoint + "/lista";

		return await this.http
						 .get<ListResult<FormaPagamento>>(url)
						 .toPromise();
	}

	public async pegaItem(id: number): Promise<ItemResult<FormaPagamento>>
	{
		let url = this.endpoint + "/item/" + id;

		return await this.http
						 .get<ItemResult<FormaPagamento>>(url)
						 .toPromise();
	}

	public async insere(item: FormaPagamento): Promise<ItemResult<FormaPagamento>>
	{
		let url = this.endpoint + "/insere";

		return await this.http
						 .post<ItemResult<FormaPagamento>>(url, item)
						 .toPromise();
	}

	public async atualiza(item: FormaPagamento): Promise<ItemResult<FormaPagamento>>
	{
		let url = this.endpoint + "/atualiza";

		return await this.http
						 .put<ItemResult<FormaPagamento>>(url, item)
						 .toPromise();
	}

	public async deleta(id: number): Promise<ItemResult<FormaPagamento>>
	{
		let url = this.endpoint + "/deleta/" + id;

		return await this.http
						 .delete<ItemResult<FormaPagamento>>(url)
						 .toPromise();
	}
}
