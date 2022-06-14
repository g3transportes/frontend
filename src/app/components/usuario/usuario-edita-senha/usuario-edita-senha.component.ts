import { Component, OnInit, Input } from '@angular/core';
import { DialogService, DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Usuario } from 'src/app/models/usuario.model';
import { ChangePassword } from 'src/app/helpers/change-password.helper';
import { Loading } from 'src/app/helpers/loading.helper';
import { UsuarioService } from 'src/app/services/usuario.service';
import { DialogServiceHelper } from 'src/app/services/dialog.service';
import { DialogTypeEnum } from 'src/app/enums/dialog-type.enum';

@Component({
	selector: 'app-usuario-edita-senha',
	templateUrl: './usuario-edita-senha.component.html',
	styleUrls: ['./usuario-edita-senha.component.css'],
	providers: [ DialogService ]
})
export class UsuarioEditaSenhaComponent implements OnInit 
{
	@Input() public id: number;
	public usuario: Usuario = new Usuario();
	public vm: ChangePassword = new ChangePassword();
	public loading: Loading = new Loading();


	constructor(private usuarioService: UsuarioService, 
		private dialogService: DialogServiceHelper, 
		private ref: DynamicDialogRef, 
		private config: DynamicDialogConfig) 
	{ 

	}

	ngOnInit() 
	{
		this.inicializa();
	}

	private inicializa(): void
	{
		//verifica id
		this.id = this.config.data.id;
		
		//carrega item
		this.carregaItem();
	}

	private carregaItem(): void
	{
		if(this.id != 0)
		{
			this.loading.Status = true

			this.usuarioService
				.pegaItem(this.id)
				.then((result) => 
			{
				if(result.IsValid)
				{
					this.usuario = result.Item;

					//objeto de mudanca de senha
					this.vm.Id = result.Item.Id;
					this.vm.CurrentPassword = result.Item.Senha;

				}
				else
				{
					this.dialogService.alert('Erro ao carregar os dados', result.Errors, DialogTypeEnum.Erro, null);
				}
			})
			.catch((error) => 
			{
				this.dialogService.alert('Erro ao carregar os dados', [ error ], DialogTypeEnum.Erro, null);
			})
			.finally(() => 
			{
				this.loading.Status = false;
			});
		}
	}

	private valida(): boolean
	{
		let isValid = true;
		let errors = new Array<string>();

		if(this.vm.Id == 0)
		{
			isValid = false;
			errors.push('Nenhum usuário selecionado');
		}

		if(!this.vm.Password)
		{
			isValid = false;
			errors.push('Senha é obrigatória');
		}

		if(!this.vm.Confirmation)
		{
			isValid = false;
			errors.push('Confirmação de senha é obrigatória');
		}

		if(this.vm.Password != this.vm.Confirmation)
		{
			isValid = false;
			errors.push('Confirmação da senha incorreta');
		}
		
		if(isValid == false)
		{
			this.dialogService.alert('Erro ao validar o formulário', errors, DialogTypeEnum.Warning , null);
		}

		return isValid;
	}

	private atualiza(): void
	{
		if(this.valida())
		{
			this.loading.Status = true;
			
			this.usuarioService
				.atualizaSenha(this.vm)
				.then((result) => 
				{
					if(result.IsValid)
					{
						this.usuario = result.Item;
						this.dialogService.alert('Informações do sistema', ['Dados atualizados com sucesso'], DialogTypeEnum.Sucesso, () => 
						{
							this.ref.close(this.vm);
						});
					}
					else
					{
						this.dialogService.alert('Erro ao salvar os dados', result.Errors, DialogTypeEnum.Erro, null);
					}
				})
				.catch((error) => 
				{
					this.dialogService.alert('Erro ao salvar os dados', [error], DialogTypeEnum.Erro, null);
				})
				.finally(() => 
				{
					this.loading.Status = false;
					this.loading.Text = '';
				});
		}
		
	}

	public onSalvar_Click(): void
	{
		this.atualiza();
	}

}
