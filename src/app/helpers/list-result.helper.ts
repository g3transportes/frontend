export class ListResult<T>
{
    public constructor()
    {
        this.CurrentPage = 1;
        this.PageSize = 20;
        this.TotalItems = 0;
        this.TotalPages = 0;
        this.Items = new Array<T>();
        this.Errors = new Array<string>();
        this.IsValid = true;
    }

    public Items: T[];
    public CurrentPage: number;
    public PageSize: number;
    public TotalItems: number;
    public TotalPages: number;
    public IsValid: boolean;
    public Errors: string[];
}