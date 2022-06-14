import { Injectable } from '@angular/core';
import { CommonHelper } from '../helpers/common.helper';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from './global.service';
import { ListResult } from '../helpers/list-result.helper';
import { Estado } from '../models/estado.model';
import { ItemResult } from '../helpers/item-result.helper';

@Injectable({
	providedIn: 'root'
})

export class EstadoService 
{
	public endpoint: string = CommonHelper.apiHost('estado');
	
	constructor(public http: HttpClient, public globalService: GlobalService) 
	{ 
		
	}

	public async pegaLista(): Promise<ListResult<Estado>>
	{
		let url = this.endpoint + "/lista";

		return await this.http
						 .get<ListResult<Estado>>(url)
						 .toPromise();
	}

	public async pegaItem(uf: string): Promise<ItemResult<Estado>>
	{
		let url = this.endpoint + "/item/uf/" + uf;

		return await this.http
						 .get<ItemResult<Estado>>(url)
						 .toPromise();
	}
}