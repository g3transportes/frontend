export class Extrato
{
    public constructor()
    {
        this.Creditos = new Array<ExtratoLancamentos>();
        this.Debitos = new Array<ExtratoLancamentos>();
    }

    public Id: number;
    public Conta: string;
    public DataInicio: Date | string | null;
    public DataFim: Date | string | null;
    public SaldoAnterior: number;
    public CreditoBaixado: number;
    public DebitoBaixado: number;
    public CreditoAberto: number;
    public DebitoAberto: number;
    public Saldo: number;
    public SaldoPrevisto: number;

    public Creditos: ExtratoLancamentos[];
    public Debitos: ExtratoLancamentos[];
}

export class ExtratoFiltro
{
    public constructor()
    {

    }

    public MyProperty: any;
    public DataInicio: Date | string | null;
    public DataFim: Date | string | null;
    public Conta: number | null;
}

export class ExtratoLancamentos
{
    public constructor()
    {

    }

    public Id: number;
    public IdPedido: number | null;
    public Tipo: string;
    public Emissao: Date | string | null;
    public Coleta: Date | string | null;
    public Entrega: Date | string | null;
    public Vencimento: Date | string | null;
    public Baixa: Date | string | null;
    public ValorBaixado: number;
    public CentroCusto: string;
    public TipoDocumento: string;
    public ContaBancaria: string;
    public FormaPagamento: string;
    public OrdemServico: string;
    public NumPedido: string;
    public Cliente: string;
    public Proprietario: string;
    public Motorista: string;
    public Favorecido: string;
    public Remetente: string;
    public LocalColeta: string;
    public Cte: string;
    public Nfe: string;
}