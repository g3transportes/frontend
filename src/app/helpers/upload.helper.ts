import { Guid } from './guid.helper';

export class Upload
{
    public constructor()
    {
        this.Id = Guid.newGuid();
    }

    public Id: string;
    public Nome: string;
    public NomeArquivo: string;
    public Caminho: string;
    public CaminhoThumbnail: string;
    public Url: string;
    public UrlThumbnail: string;
    public Tamanho: number;
}