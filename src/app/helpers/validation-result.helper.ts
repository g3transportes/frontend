export class ValidationResult
{
    public constructor()
    {
        this.Errors = new Array<string>();
        this.IsValid = true;

    }

    public IsValid: boolean;
    public Errors: string[];
}