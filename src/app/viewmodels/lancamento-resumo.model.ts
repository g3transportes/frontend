export class LancamentoResumo
{
    public constructor()
    {
        this.ItemsPagar = new Array<LancamentoResumoItem>();
        this.ItemsPago = new Array<LancamentoResumoItem>();
        this.ItemsReceber = new Array<LancamentoResumoItem>();
        this.ItemsRecebido = new Array<LancamentoResumoItem>();
    }

    public Id: number;
    public Nome: string;
    public Referencia: string;
    public EmissaoInicio: Date | string | null;
    public EmissaoFim: Date | string | null;
    public VencimentoInicio: Date | string | null;
    public VencimentoFim: Date | string | null;
    public TotalPagar: number;
    public TotalPago: number;
    public TotalReceber: number;
    public TotalRecebido: number;

    public ItemsPagar: LancamentoResumoItem[];
    public ItemsPago: LancamentoResumoItem[];
    public ItemsReceber: LancamentoResumoItem[];
    public ItemsRecebido: LancamentoResumoItem[];
}

export class LancamentoResumoItem
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
    public Valor: number;
    public ValorBaixado: number;
    public ValorSaldo: number;
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
