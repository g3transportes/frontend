export class CaminhaoFilter
{
    public constructor()
    {
        this.CodigoFilter = false;
        this.MotoristaFilter = false;
        this.ProprietarioFilter = false;
        this.NomeFilter = false;
        this.PlacaFilter = false;
        this.RenavamFilter = false;
        this.CidadeFilter = false;
        this.ModeloFilter = false;
        this.CapacidadeFilter = false;
        this.AtivoFilter = false;
    }

    public CodigoFilter: boolean;
    public CodigoValue: number[];

    public MotoristaFilter: boolean;
    public MotoristaValue: number | null;

    public ProprietarioFilter: boolean;
    public ProprietarioValue: number | null;

    public NomeFilter: boolean;
    public NomeValue: string;

    public PlacaFilter: boolean;
    public PlacaValue: string;

    public RenavamFilter: boolean;
    public RenavamValue: string;

    public CidadeFilter: boolean;
    public CidadeValue: string;

    public ModeloFilter: boolean;
    public ModeloValue: string;

    public CapacidadeFilter: boolean;
    public CapacidadeValue: number | null;

    public AtivoFilter: boolean;
    public AtivoValue: boolean;
}