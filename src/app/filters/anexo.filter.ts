export class AnexoFilter
{
    public constructor()
    {
        this.CodigoFilter = false;
        this.DescricaoFilter = false;
    }

    public CodigoFilter: boolean;
    public CodigoValue: number[];

    public DescricaoFilter: boolean;
    public DescricaoValue: string;
}