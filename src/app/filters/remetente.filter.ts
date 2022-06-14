export class RemetenteFilter
{
    public constructor()
    {
        this.CodigoFilter = false;
        this.NomeFilter = false;
        this.DocumentoFilter = false;
        this.DescricaoFilter = false;
        this.EstoqueValue = false;
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

    public EstoqueFilter: boolean;
    public EstoqueValue: boolean;

    public AtivoFilter: boolean;
    public AtivoValue: boolean;
}