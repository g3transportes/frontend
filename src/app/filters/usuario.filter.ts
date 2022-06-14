export class UsuarioFilter
{
    public constructor()
    {
        this.CodigoFilter = false;
        this.NomeFilter = false;
        this.EmailFilter = false;
        this.SenhaFilter = false;
        this.AtivoFilter = false;
    }

    public CodigoFilter: boolean;
    public CodigoValue: number[];

    public NomeFilter: boolean;
    public NomeValue: string;

    public EmailFilter: boolean;
    public EmailValue: string;

    public SenhaFilter: boolean;
    public SenhaValue: string;

    public AtivoFilter: boolean;
    public AtivoValue: boolean;
}