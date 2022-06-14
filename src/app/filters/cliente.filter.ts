export class ClienteFilter
{
    public constructor()
    {
        this.CodigoFilter = false;
        this.NomeFilter = false;
        this.DocumentoFilter = false;
        this.DescricaoFilter = false;
        this.AtivoFilter = false;
    }

    public CodigoFilter: boolean;
    public CodigoValue: number[];

    public NomeFilter: boolean;
    public NomeValue: string;

    public DocumentoFilter: boolean;
    public DocumentoValue: string;

    public DescricaoFilter: boolean;
    public DescricaoValue: string;

    public AtivoFilter: boolean;
    public AtivoValue: boolean;
}