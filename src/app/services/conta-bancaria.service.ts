import { Injectable } from '@angular/core';
import { CommonHelper } from '../helpers/common.helper';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from './global.service';
import { ListResult } from '../helpers/list-result.helper';
import { ContaBancaria } from '../models/conta-bancaria.model';
import { ItemResult } from '../helpers/item-result.helper';
import { ExtratoFiltro, Extrato } from '../viewmodels/extrato.model';

@Injectable({
	providedIn: 'root'
})
export class ContaBancariaService 
{
	public endpoint: string = CommonHelper.apiHost('conta-bancaria');
	
	constructor(public http: HttpClient, public globalService: GlobalService) 
	{ 
		
	}

	public async pegaLista(): Promise<ListResult<ContaBancaria>>
	{
		let url = this.endpoint + "/lista";

		return await this.http
						 .get<ListResult<ContaBancaria>>(url)
						 .toPromise();
	}

	public async pegaItem(id: number): Promise<ItemResult<ContaBancaria>>
	{
		let url = this.endpoint + "/item/" + id;

		return await this.http
						 .get<ItemResult<ContaBancaria>>(url)
						 .toPromise();
	}

	public async extrato(filtro: ExtratoFiltro): Promise<ListResult<Extrato>>
	{
		let url = this.endpoint + "/extrato";

		return await this.http
						 .post<ListResult<Extrato>>(url, filtro)
						 .toPromise();
	}
	
	public async insere(item: ContaBancaria): Promise<ItemResult<ContaBancaria>>
	{
		let url = this.endpoint + "/insere";

		return await this.http
						 .post<ItemResult<ContaBancaria>>(url, item)
						 .toPromise();
	}

	public async atualiza(item: ContaBancaria): Promise<ItemResult<ContaBancaria>>
	{
		let url = this.endpoint + "/atualiza";

		return await this.http
						 .put<ItemResult<ContaBancaria>>(url, item)
						 .toPromise();
	}

	public async deleta(id: number): Promise<ItemResult<ContaBancaria>>
	{
		let url = this.endpoint + "/deleta/" + id;

		return await this.http
						 .delete<ItemResult<ContaBancaria>>(url)
						 .toPromise();
	}
}
