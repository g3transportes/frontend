export class Usuario
{
    public constructor()
    {
        this.Id = 0;
        this.Nome = '';
        this.Email = '';
        this.Senha = '';
        this.Ativo = true;
        this.Financeiro = false;
        this.Administrador = false;
    }

    public Id: number;
    public Nome: string;
    public Email: string;
    public Senha: string;
    public Ativo: boolean;
    public Financeiro: boolean;
    public Administrador: boolean;
}