import { Lancamento } from './lancamento.model';

export class TipoDocumento
{
    public constructor()
    {
        this.Id = 0;
        this.Nome = '';
        this.Ativo = true;
        
        this.Lancamentos = new Array<Lancamento>();
    }

    public Id: number;
    public Nome: string;
    public Ativo: boolean;

    public Lancamentos: Lancamento[];
}