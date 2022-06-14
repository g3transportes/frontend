export class ItemResult<T>
{
    public constructor()
    {
        this.Errors = new Array<string>();
        this.IsValid = true;

    }

    public Item: T;
    public IsValid: boolean;
    public Errors: string[];
}