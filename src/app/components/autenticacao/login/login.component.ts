import { Component, OnInit } from '@angular/core';
import { Login } from 'src/app/helpers/login.helper';
import { Loading } from 'src/app/helpers/loading.helper';
import { UsuarioService } from 'src/app/services/usuario.service';
import { GlobalService } from 'src/app/services/global.service';
import { Router } from '@angular/router';
import { DialogTypeEnum } from 'src/app/enums/dialog-type.enum';
import { DialogServiceHelper } from 'src/app/services/dialog.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit 
{
	public vm: Login = new Login();
	public loading: Loading = new Loading();
	
	constructor(private usuarioService: UsuarioService, 
		private globalService: GlobalService,
		private dialogService: DialogServiceHelper,
		private router: Router) 
	{ 

	}

	ngOnInit() 
	{
	}

	private validaLogin(): boolean
	{
		let isValid: boolean = true;
		let errors: string[] = new Array<string>();

		if(!this.vm.Email)
		{
			isValid = false;
			errors.push('Informe o email');
		}

		if(!this.vm.Password)
		{
			isValid = false;
			errors.push('Informe a senha');
		}

		if(!isValid)
		{
			console.log(errors);
			this.dialogService.alert('Erro de validaçao', errors, DialogTypeEnum.Warning, null);
		}

		return isValid;
	}

	private login(): void
	{
		if(this.validaLogin())
		{
			this.loading.Status = true;

			this.usuarioService
				.login(this.vm)
				.then((result) => 
				{
					if(result.IsValid)
					{
						if(result.Item != null)
						{
							this.globalService.currentUser = result.Item;
							this.globalService.salvaLogin();
							this.router.navigate(['']);
						}
						else
						{
							this.dialogService.alert('Não foi possível efetuar o login', ['Usuário não existe ou senha incorreta'], DialogTypeEnum.Warning, null);
						}
					}
					else
					{
						this.dialogService.alert('Erro ao efetuar login', result.Errors, DialogTypeEnum.Erro, null);
					}
				})
				.catch((error) => 
				{
					this.dialogService.alert('Erro ao efetuar login', [JSON.stringify(error)], DialogTypeEnum.Erro, null);
	
				})
				.finally(() => 
				{
					this.loading.Status = false;
				});
		}
	}

	public onLogin_Click(): void
	{
		this.login();
	}

	public onRecover_Click(): void
	{
		//this.login();
	}


}
