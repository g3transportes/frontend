import { Lancamento } from './lancamento.model';
import { CommonHelper } from '../helpers/common.helper';
import { ContaBancaria } from './conta-bancaria.model';
import { FormaPagamento } from './forma-pagamento.model';

export class LancamentoBaixa
{
    public constructor()
    {
        this.Id = 0;
        this.IdLancamento = 0;
        this.Valor = 0;
        this.Data = CommonHelper.getToday();
        this.Observacao = '';
    }

    public Id: number;
    public IdLancamento: number;
    public IdContaBancaria: number | null;
    public IdFormaPagamento: number | null;
    public Tipo: string;
    public Valor: number;
    public Data: Date | string;
    public Observacao: string;

    public Lancamento: Lancamento;
    public ContaBancaria: ContaBancaria;
    public FormaPagamento: FormaPagamento;
}