import { CommonHelper } from "../helpers/common.helper";

export class PedidoFilter
{
    public constructor()
    {
        this.CodigoFilter = false;
        this.CaminhaoFilter = false;
        this.ClienteFilter = false;
        this.RemetenteFilter = false;
        this.OrdemServicoFilter = false;
        this.NumPedidoFilter = false;
        this.CTeFilter = false;
        this.NFeFilter = false;
        this.DataEmissaoFilter = false;
        this.DataColetaFilter = false;
        this.DataEntregaFilter = false;
        this.DataPagamentoFilter = false;
        this.DataFinalizadoFilter = false;
        this.DataFinalizadoFilter = false;
        this.ValorBrutoFilter = false;
        this.ValorLiquidoFilter = false;
        this.ValorFreteFilter = false;
        this.ValorComissaoFilter = false;
        this.DescricaoFilter = false;
        this.FinalizadoFilter = false;
        this.ColetadoFilter = false;
        this.EntregueFilter = false;
        this.SolicitacaoFilter = false;
        this.PagoFilter = false;
        this.DevolvidoFilter = false;
        this.AtivoFilter = false;

        this.MesFilter = false;
        this.AnoFilter = false;

        this.MesValue = CommonHelper.getToday().getMonth() + 1;
        this.AnoValue = CommonHelper.getToday().getFullYear();
    }

    public CodigoFilter: boolean;
    public CodigoValue: number[];

    public CaminhaoFilter: boolean;
    public CaminhaoValue: number | null;

    public ClienteFilter: boolean;
    public ClienteValue: number | null;

    public RemetenteFilter: boolean;
    public RemetenteValue: number | null;

    public OrdemServicoFilter: boolean;
    public OrdemServicoValue: string;

    public NumPedidoFilter: boolean;
    public NumPedidoValue: string;

    public CTeFilter: boolean;
    public CTeValue: string;

    public NFeFilter: boolean;
    public NFeValue: string;

    public DataEmissaoFilter: boolean;
    public DataEmissaoMinValue: Date | string | null;
    public DataEmissaoMaxValue: Date | string | null;

    public DataColetaFilter: boolean;
    public DataColetaMinValue: Date | string | null;
    public DataColetaMaxValue: Date | string | null;

    public DataEntregaFilter: boolean;
    public DataEntregaMinValue: Date | string | null;
    public DataEntregaMaxValue: Date | string | null;

    public DataPagamentoFilter: boolean;
    public DataPagamentoMinValue: Date | string | null;
    public DataPagamentoMaxValue: Date | string | null;

    public DataFinalizadoFilter: boolean;
    public DataFinalizadoMinValue: Date | string | null;
    public DataFinalizadoMaxValue: Date | string | null;

    public DataDevolucaoFilter: boolean;
    public DataDevolucaoMinValue: Date | string | null;
    public DataDevolucaoMaxValue: Date | string | null;

    public ValorBrutoFilter: boolean;
    public ValorBrutoValue: number | null;

    public ValorLiquidoFilter: boolean;
    public ValorLiquidoValue: number | null;

    public ValorFreteFilter: boolean;
    public ValorFreteValue: number | null;

    public ValorComissaoFilter: boolean;
    public ValorComissaoValue: number | null;

    public DescricaoFilter: boolean;
    public DescricaoValue: string;

    public SolicitacaoFilter: boolean;
    public SolicitacaoValue: boolean | null;

    public FinalizadoFilter: boolean;
    public FinalizadoValue: boolean | null;

    public ColetadoFilter: boolean;
    public ColetadoValue: boolean | null;

    public EntregueFilter: boolean;
    public EntregueValue: boolean | null;

    public PagoFilter: boolean;
    public PagoValue: boolean | null;

    public DevolvidoFilter: boolean;
    public DevolvidoValue: boolean | null;

    public AtivoFilter: boolean;
    public AtivoValue: boolean | null;

    public MesFilter: boolean;
    public MesValue: number | null;

    public AnoFilter: boolean;
    public AnoValue: number | null;
}