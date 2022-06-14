import { Injectable } from '@angular/core';
import { CommonHelper } from '../helpers/common.helper';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from './global.service';
import { ListResult } from '../helpers/list-result.helper';
import { LancamentoBaixa } from '../models/lancamento-baixa.model';
import { ItemResult } from '../helpers/item-result.helper';
import { LancamentoBaixaFilter } from '../filters/lancamento-baixa.filter';

@Injectable({
	providedIn: 'root'
})
export class LancamentoBaixaService 
{
	public endpoint: string = CommonHelper.apiHost('lancamento-baixa');
	
	constructor(public http: HttpClient, public globalService: GlobalService) 
	{ 
		
	}

	public async pegaLista(filter: LancamentoBaixaFilter, pagina: number, tamanho: number): Promise<ListResult<LancamentoBaixa>>
	{
		let url = this.endpoint + "/lista/" + pagina + "/" + tamanho;

		return await this.http
						 .post<ListResult<LancamentoBaixa>>(url, filter)
						 .toPromise();
	}

	public async pegaItem(id: number): Promise<ItemResult<LancamentoBaixa>>
	{
		let url = this.endpoint + "/item/" + id;

		return await this.http
						 .get<ItemResult<LancamentoBaixa>>(url)
						 .toPromise();
	}

	public async insere(item: LancamentoBaixa): Promise<ItemResult<LancamentoBaixa>>
	{
		let url = this.endpoint + "/insere";

		return await this.http
						 .post<ItemResult<LancamentoBaixa>>(url, item)
						 .toPromise();
	}

	public async atualiza(item: LancamentoBaixa): Promise<ItemResult<LancamentoBaixa>>
	{
		let url = this.endpoint + "/atualiza";

		return await this.http
						 .put<ItemResult<LancamentoBaixa>>(url, item)
						 .toPromise();
	}

	public async deleta(id: number): Promise<ItemResult<LancamentoBaixa>>
	{
		let url = this.endpoint + "/deleta/" + id;

		return await this.http
						 .delete<ItemResult<LancamentoBaixa>>(url)
						 .toPromise();
	}
}
