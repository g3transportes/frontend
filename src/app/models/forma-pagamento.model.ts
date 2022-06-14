import { Lancamento } from './lancamento.model';
import { LancamentoBaixa } from './lancamento-baixa.model';

export class FormaPagamento
{
    public constructor()
    {
        this.Id = 0;
        this.Nome = '';
        this.Ativo = true;
        
        this.Lancamentos = new Array<Lancamento>();
        this.Baixas = new Array<LancamentoBaixa>();
    }

    public Id: number;
    public Nome: string;
    public Ativo: boolean;

    public Lancamentos: Lancamento[];
    public Baixas: LancamentoBaixa[];
}