export class ConciliacaoFilter
{
    public constructor()
    {
    }

    public CodigoFilter: boolean;
    public CodigoValue: number[];

    public BancoFilter: boolean;
    public BancoValue: number | null;

    public DataFilter: boolean;
    public DataMinValue: Date | string | null;
    public DataMaxValue: Date | string | null;

    public AnexoFilter: boolean;
    public AnexoValue: string;
}