export class RemetenteEstoqueFilter
{
    public constructor()
    {
        this.CodigoFilter = false;
        this.RemetenteFilter = false;
        this.PedidoFilter = false;
        this.ClienteFilter = false;
        this.TipoFilter = false;
        this.DataFilter = false;
        this.TransferenciaFilter = false;
        this.AtivoFilter = false;

        this.CodigoValue = new Array<number>();
    }

    public CodigoFilter: boolean;
    public CodigoValue: number[];

    public RemetenteFilter: boolean;
    public RemetenteValue: number | null;

    public PedidoFilter: boolean;
    public PedidoValue: number | null;

    public ClienteFilter: boolean;
    public ClienteValue: number | null;

    public TipoFilter: boolean;
    public TipoValue: string;

    public DataFilter: boolean;
    public DataMinValue: Date | string | null;
    public DataMaxValue: Date | string | null;

    public TransferenciaFilter: boolean;
    public TransferenciaValue: boolean | null;

    public AtivoFilter: boolean;
    public AtivoValue: boolean | null;
}