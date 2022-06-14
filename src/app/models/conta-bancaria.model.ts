import { Lancamento } from './lancamento.model';
import { LancamentoBaixa } from './lancamento-baixa.model';
import { Conciliacao } from './conciliacao.model';

export class ContaBancaria
{
    public constructor()
    {
        this.Id = 0;
        this.Nome = '';
        this.Banco = '';
        this.Agencia = '';
        this.Operacao = '';
        this.Conta = '';
        this.Titular = '';
        this.Documento = '';
        this.Observacao = '';
        this.SaldoInicial = 0;
        this.SaldoAtual = 0;
        this.Creditos = 0;
        this.Debitos = 0;
        this.Ativo = true;

        this.Lancamentos = new Array<Lancamento>();
        this.Baixas = new Array<LancamentoBaixa>();
        this.Conciliacoes = new Array<Conciliacao>();
    }

    public Id: number;
    public Nome: string;
    public Banco: string;
    public Agencia: string;
    public Operacao: string;
    public Conta: string;
    public Titular: string;
    public Documento: string;
    public Observacao: string;
    public SaldoInicial: number;
    public SaldoAtual: number;
    public Creditos: number;
    public Debitos: number;
    public Ativo: boolean;

    public Lancamentos: Lancamento[];
    public Baixas: LancamentoBaixa[];
    public Conciliacoes: Conciliacao[];
}