import { RemetenteEstoque } from '../models/remetente-estoque.model';

export class Estoque
{
    public constructor()
    {
        this.Movimentacoes = new Array<RemetenteEstoque>();    
    }

    public DataInicio: Date | string;
    public DataFim: Date | string;
    public SaldoAnterior: number;
    public Creditos: number;
    public Debitos: number;
    public SaldoAtual: number;
    public IdRemetente: number | null;
    public Remetente: string;
    public IdCliente: number | null;
    public Cliente: string;

    public Movimentacoes: RemetenteEstoque[];
}