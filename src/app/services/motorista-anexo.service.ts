import { Injectable } from '@angular/core';
import { CommonHelper } from '../helpers/common.helper';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from './global.service';
import { MotoristaAnexoFilter } from '../filters/motorista-anexo.filter';
import { ListResult } from '../helpers/list-result.helper';
import { MotoristaAnexo } from '../models/motorista-anexo.model';
import { ItemResult } from '../helpers/item-result.helper';

@Injectable({
	providedIn: 'root'
})
export class MotoristaAnexoService 
{
	public endpoint: string = CommonHelper.apiHost('motorista-anexo');
	
	constructor(public http: HttpClient, public globalService: GlobalService) 
	{ 
		
	}

	public async pegaLista(filter: MotoristaAnexoFilter, pagina: number, tamanho: number): Promise<ListResult<MotoristaAnexo>>
	{
		let url = this.endpoint + "/lista/" + pagina + "/" + tamanho;

		return await this.http
						 .post<ListResult<MotoristaAnexo>>(url, filter)
						 .toPromise();
	}

	public async pegaItem(idMotorista: number, idAnexo: number): Promise<ItemResult<MotoristaAnexo>>
	{
		let url = this.endpoint + "/item/motorista/" + idMotorista + "/anexo/" + idAnexo;

		return await this.http
						 .get<ItemResult<MotoristaAnexo>>(url)
						 .toPromise();
	}

	public async insere(item: MotoristaAnexo): Promise<ItemResult<MotoristaAnexo>>
	{
		let url = this.endpoint + "/insere";

		return await this.http
						 .post<ItemResult<MotoristaAnexo>>(url, item)
						 .toPromise();
	}

	public async insereVarios(lista: Array<MotoristaAnexo>): Promise<ListResult<MotoristaAnexo>>
	{
		let url = this.endpoint + "/insere/varios";

		return await this.http
						 .post<ListResult<MotoristaAnexo>>(url, lista)
						 .toPromise();
	}

	public async atualiza(item: MotoristaAnexo): Promise<ItemResult<MotoristaAnexo>>
	{
		let url = this.endpoint + "/atualiza";

		return await this.http
						 .put<ItemResult<MotoristaAnexo>>(url, item)
						 .toPromise();
	}

	public async deleta(idMotorista: number, idAnexo: number): Promise<ItemResult<MotoristaAnexo>>
	{
		let url = this.endpoint + "/deleta/motorista/" + idMotorista + "/anexo/" + idAnexo;

		return await this.http
						 .delete<ItemResult<MotoristaAnexo>>(url)
						 .toPromise();
	}
}
