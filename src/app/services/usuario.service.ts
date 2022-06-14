import { Injectable } from '@angular/core';
import { CommonHelper } from '../helpers/common.helper';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from './global.service';
import { UsuarioFilter } from '../filters/usuario.filter';
import { ListResult } from '../helpers/list-result.helper';
import { Usuario } from '../models/usuario.model';
import { ItemResult } from '../helpers/item-result.helper';
import { Login } from '../helpers/login.helper';
import { RecoverPassword } from '../helpers/recover-password.helper';
import { ChangePassword } from '../helpers/change-password.helper';

@Injectable({
	providedIn: 'root'
})
export class UsuarioService 
{
	public endpoint: string = CommonHelper.apiHost('usuario');
	
	constructor(public http: HttpClient, public globalService: GlobalService) 
	{ 
		
	}

	public async pegaLista(filter: UsuarioFilter, pagina: number, tamanho: number): Promise<ListResult<Usuario>>
	{
		let url = this.endpoint + "/lista/" + pagina + "/" + tamanho;

		return await this.http
						 .post<ListResult<Usuario>>(url, filter)
						 .toPromise();
	}

	public async pegaItem(id: number): Promise<ItemResult<Usuario>>
	{
		let url = this.endpoint + "/item/" + id;

		return await this.http
						 .get<ItemResult<Usuario>>(url)
						 .toPromise();
	}

	public async login(item: Login): Promise<ItemResult<Usuario>>
	{
		let url = this.endpoint + "/login";

		return await this.http
						 .post<ItemResult<Usuario>>(url, item)
						 .toPromise();
    }

    public async recupera(item: RecoverPassword): Promise<ItemResult<RecoverPassword>>
	{
		let url = this.endpoint + "/recupera";

		return await this.http
						 .post<ItemResult<RecoverPassword>>(url, item)
						 .toPromise();
    }
    
    public async insere(item: Usuario): Promise<ItemResult<Usuario>>
	{
		let url = this.endpoint + "/insere";

		return await this.http
						 .post<ItemResult<Usuario>>(url, item)
						 .toPromise();
	}

	public async atualiza(item: Usuario): Promise<ItemResult<Usuario>>
	{
		let url = this.endpoint + "/atualiza";

		return await this.http
						 .put<ItemResult<Usuario>>(url, item)
						 .toPromise();
    }
    
    public async atualizaSenha(item: ChangePassword): Promise<ItemResult<Usuario>>
	{
		let url = this.endpoint + "/atualiza/senha";

		return await this.http
						 .put<ItemResult<Usuario>>(url, item)
						 .toPromise();
	}

	public async deleta(id: number): Promise<ItemResult<Usuario>>
	{
		let url = this.endpoint + "/deleta/" + id;

		return await this.http
						 .delete<ItemResult<Usuario>>(url)
						 .toPromise();
	}
}