import { CommonHelper } from "../helpers/common.helper";

export class LancamentoBaixaFilter
{
    public constructor()
    {
        this.CodigoFilter = false;
        this.LancamentoFilter = false;
        this.TipoFilter = false;
        this.PedidoFilter = false;
        this.ClienteFilter = false;
        this.CaminhaoFilter = false;
        this.ProprietarioFilter = false;
        this.FormaPagamentoFilter = false;
        this.ContaBancariaFilter = false;
        this.CentroCustoFilter = false;
        this.TipoDocumentoFilter = false;
        this.FavorecidoFilter = false;
        this.EmissaoFilter = false;
        this.DataFilter = false;

        this.MesFilter = false;
        this.AnoFilter = false;

        this.MesValue = CommonHelper.getToday().getMonth() + 1;
        this.AnoValue = CommonHelper.getToday().getFullYear();
    }

    public CodigoFilter: boolean;
    public CodigoValue: number[];

    public LancamentoFilter: boolean;
    public LancamentoValue: number | null;

    public TipoFilter: boolean;
    public TipoValue: string;

    public PedidoFilter: boolean;
    public PedidoValue: number | null;

    public ClienteFilter: boolean;
    public ClienteValue: number | null;

    public CaminhaoFilter: boolean;
    public CaminhaoValue: number | null;

    public ProprietarioFilter: boolean;
    public ProprietarioValue: number | null;

    public FormaPagamentoFilter: boolean;
    public FormaPagamentoValue: number | null;

    public ContaBancariaFilter: boolean;
    public ContaBancariaValue: number | null;

    public CentroCustoFilter: boolean;
    public CentroCustoValue: number | null;

    public TipoDocumentoFilter: boolean;
    public TipoDocumentoValue: number | null;

    public FavorecidoFilter: boolean;
    public FavorecidoValue: string;

    public EmissaoFilter: boolean;
    public EmissaoMinValue: Date | string | null;
    public EmissaoMaxValue: Date | string | null;

    public DataFilter: boolean;
    public DataMinValue: Date | string | null;
    public DataMaxValue: Date | string | null;

    public MesFilter: boolean;
    public MesValue: number | null;

    public AnoFilter: boolean;
    public AnoValue: number | null;
}