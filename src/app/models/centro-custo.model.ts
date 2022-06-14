import { Lancamento } from './lancamento.model';

export class CentroCusto
{
    public constructor()
    {
        this.Id = 0;
        this.Referencia = '';
        this.Nome = '';
        this.Descricao = '';
        this.Tipo = 'C';
        this.UltimoNivel = true;
        this.Padrao = false;
        this.Ativo = true;

        this.Lancamentos = new Array<Lancamento>();
    }

    public Id: number;
    public Referencia: string;
    public Nome: string;
    public Descricao: string;
    public Tipo: string;
    public Padrao: boolean;
	public UltimoNivel: boolean;
    public Ativo: boolean;

    public Lancamentos: Lancamento[];
}
