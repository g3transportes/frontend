import { Injectable } from '@angular/core';
import { CommonHelper } from '../helpers/common.helper';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from './global.service';
import { ProprietarioAnexoFilter } from '../filters/proprietario-anexo.filter';
import { ListResult } from '../helpers/list-result.helper';
import { ProprietarioAnexo } from '../models/proprietario-anexo.model';
import { ItemResult } from '../helpers/item-result.helper';

@Injectable({
	providedIn: 'root'
})
export class ProprietarioAnexoService 
{
	public endpoint: string = CommonHelper.apiHost('proprietario-anexo');
	
	constructor(public http: HttpClient, public globalService: GlobalService) 
	{ 
		
	}

	public async pegaLista(filter: ProprietarioAnexoFilter, pagina: number, tamanho: number): Promise<ListResult<ProprietarioAnexo>>
	{
		let url = this.endpoint + "/lista/" + pagina + "/" + tamanho;

		return await this.http
						 .post<ListResult<ProprietarioAnexo>>(url, filter)
						 .toPromise();
	}

	public async pegaItem(idProprietario: number, idAnexo: number): Promise<ItemResult<ProprietarioAnexo>>
	{
		let url = this.endpoint + "/item/proprietario/" + idProprietario + "/anexo/" + idAnexo;

		return await this.http
						 .get<ItemResult<ProprietarioAnexo>>(url)
						 .toPromise();
	}

	public async insere(item: ProprietarioAnexo): Promise<ItemResult<ProprietarioAnexo>>
	{
		let url = this.endpoint + "/insere";

		return await this.http
						 .post<ItemResult<ProprietarioAnexo>>(url, item)
						 .toPromise();
	}

	public async insereVarios(lista: Array<ProprietarioAnexo>): Promise<ListResult<ProprietarioAnexo>>
	{
		let url = this.endpoint + "/insere/varios";

		return await this.http
						 .post<ListResult<ProprietarioAnexo>>(url, lista)
						 .toPromise();
	}

	public async atualiza(item: ProprietarioAnexo): Promise<ItemResult<ProprietarioAnexo>>
	{
		let url = this.endpoint + "/atualiza";

		return await this.http
						 .put<ItemResult<ProprietarioAnexo>>(url, item)
						 .toPromise();
	}

	public async deleta(idProprietario: number, idAnexo: number): Promise<ItemResult<ProprietarioAnexo>>
	{
		let url = this.endpoint + "/deleta/proprietario/" + idProprietario + "/anexo/" + idAnexo;

		return await this.http
						 .delete<ItemResult<ProprietarioAnexo>>(url)
						 .toPromise();
	}
}