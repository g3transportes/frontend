import { Component, OnInit, Input } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { Loading } from 'src/app/helpers/loading.helper';
import { UsuarioService } from 'src/app/services/usuario.service';
import { DialogServiceHelper } from 'src/app/services/dialog.service';
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import { DialogTypeEnum } from 'src/app/enums/dialog-type.enum';

@Component({
	selector: 'app-usuario-edita',
	templateUrl: './usuario-edita.component.html',
	styleUrls: ['./usuario-edita.component.css'],
	providers: [ DialogService ]
})
export class UsuarioEditaComponent implements OnInit 
{
	@Input() public id: number;
	public vm: Usuario = new Usuario();
	public confirmaSenha: string = '';
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
					this.vm = result.Item;
					this.formataDatas();
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
		else
		{
			this.vm = new Usuario();
		}
	}

	private formataDatas(): void
	{
		//resolve probelmas de data
	}

	private valida(): boolean
	{
		let isValid = true;
		let errors = new Array<string>();

		if(!this.vm.Nome)
		{
			isValid = false;
			errors.push('Nome é obrigatório');
		}

		if(!this.vm.Email)
		{
			isValid = false;
			errors.push('Email é obrigatório');
		}
		else
		{
			let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			
			if(!re.test(this.vm.Email))
			{
				isValid = false;
				errors.push("Email informado é inválido.");
			}
		}

		//valida senha ai incluir
		if(this.vm.Id == 0)
		{
			if(!this.vm.Senha)
			{
				isValid = false;
				errors.push('Senha é obrigatória');
			}

			if(!this.confirmaSenha)
			{
				isValid = false;
				errors.push('Confirmação de senha é obrigatória');
			}

			if(this.vm.Senha != this.confirmaSenha)
			{
				isValid = false;
				errors.push('Confirmação da senha incorreta');
			}
		}

		
		if(isValid == false)
		{
			this.dialogService.alert('Erro ao validar o formulário', errors, DialogTypeEnum.Warning , null);
		}

		return isValid;
	}

	private insere(): void
	{
		if(this.valida())
		{
			this.loading.Status = true;

			this.usuarioService
				.insere(this.vm)
				.then((result) => 
				{
					if(result.IsValid)
					{
						this.vm = result.Item;
						this.formataDatas();

						this.dialogService.alert('Informações do sistema', ['Dados incluídos com sucesso'], DialogTypeEnum.Sucesso, () => 
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
				})
		}
		
	}

	private atualiza(): void
	{
		if(this.valida())
		{
			this.loading.Status = true;
			
			this.usuarioService
				.atualiza(this.vm)
				.then((result) => 
				{
					if(result.IsValid)
					{
						this.vm = result.Item;
						this.formataDatas();
						
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
				})
		}
		
	}

	public onSalvar_Click(): void
	{
		if(this.vm.Id == 0)
			this.insere();
		else
			this.atualiza();
	}

}
