import { Injectable } from '@angular/core';
import { CommonHelper } from '../helpers/common.helper';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from './global.service';
import { Configuracao } from '../models/configuracao.model';
import { ItemResult } from '../helpers/item-result.helper';

@Injectable({
	providedIn: 'root'
})

export class ConfiguracaoService 
{
	public endpoint: string = CommonHelper.apiHost('configuracao');
	
	constructor(public http: HttpClient, public globalService: GlobalService) 
	{ 
		
	}

	public async pega(): Promise<ItemResult<Configuracao>>
	{
		let url = this.endpoint + "/item";

		return await this.http
						 .get<ItemResult<Configuracao>>(url)
						 .toPromise();
	}

	public async atualiza(item: Configuracao): Promise<ItemResult<Configuracao>>
	{
		let url = this.endpoint + "/atualiza";

		return await this.http
						 .put<ItemResult<Configuracao>>(url, item)
						 .toPromise();
	}
}
