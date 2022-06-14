import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { MenuItem } from 'primeng/api/menuitem';

@Injectable({
	providedIn: 'root'
})
export class GlobalService 
{
	public currentUser: Usuario;
	public home: MenuItem;
	public breadcrumb: MenuItem[];


	constructor(public router: Router, private localStorageService: LocalStorageService) 
	{ 

	}

	public verificaLogado(): void
	{
		let usuario = this.localStorageService.get<Usuario>('usuario');

		if(usuario != null)
		{
			this.currentUser = usuario;
		}
		else
		{
			this.currentUser = null;
			this.router.navigate(['autenticacao/login']);
		}
	}

	public salvaLogin(): void
	{
		this.localStorageService.set('usuario', this.currentUser);
	}


}
