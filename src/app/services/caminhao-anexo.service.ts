import { Injectable } from '@angular/core';
import { CommonHelper } from '../helpers/common.helper';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from './global.service';
import { CaminhaoAnexoFilter } from '../filters/caminhao-anexo.filter';
import { ListResult } from '../helpers/list-result.helper';
import { CaminhaoAnexo } from '../models/caminhao-anexo.model';
import { ItemResult } from '../helpers/item-result.helper';

@Injectable({
	providedIn: 'root'
})
export class CaminhaoAnexoService 
{
	public endpoint: string = CommonHelper.apiHost('caminhao-anexo');
	
	constructor(public http: HttpClient, public globalService: GlobalService) 
	{ 
		
	}

	public async pegaLista(filter: CaminhaoAnexoFilter, pagina: number, tamanho: number): Promise<ListResult<CaminhaoAnexo>>
	{
		let url = this.endpoint + "/lista/" + pagina + "/" + tamanho;

		return await this.http
						 .post<ListResult<CaminhaoAnexo>>(url, filter)
						 .toPromise();
	}

	public async pegaItem(idCaminhao: number, idAnexo: number): Promise<ItemResult<CaminhaoAnexo>>
	{
		let url = this.endpoint + "/item/caminhao/" + idCaminhao + "/anexo/" + idAnexo;

		return await this.http
						 .get<ItemResult<CaminhaoAnexo>>(url)
						 .toPromise();
	}

	public async insere(item: CaminhaoAnexo): Promise<ItemResult<CaminhaoAnexo>>
	{
		let url = this.endpoint + "/insere";

		return await this.http
						 .post<ItemResult<CaminhaoAnexo>>(url, item)
						 .toPromise();
	}

	public async insereVarios(lista: Array<CaminhaoAnexo>): Promise<ListResult<CaminhaoAnexo>>
	{
		let url = this.endpoint + "/insere/varios";

		return await this.http
						 .post<ListResult<CaminhaoAnexo>>(url, lista)
						 .toPromise();
	}

	public async atualiza(item: CaminhaoAnexo): Promise<ItemResult<CaminhaoAnexo>>
	{
		let url = this.endpoint + "/atualiza";

		return await this.http
						 .put<ItemResult<CaminhaoAnexo>>(url, item)
						 .toPromise();
	}

	public async deleta(idCaminhao: number, idAnexo: number): Promise<ItemResult<CaminhaoAnexo>>
	{
		let url = this.endpoint + "/deleta/caminhao/" + idCaminhao + "/anexo/" + idAnexo;

		return await this.http
						 .delete<ItemResult<CaminhaoAnexo>>(url)
						 .toPromise();
	}
}