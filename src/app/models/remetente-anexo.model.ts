import { Remetente } from './remetente.model';
import { Anexo } from './anexo.model';
import { CommonHelper } from '../helpers/common.helper';

export class RemetenteAnexo
{
    public constructor()
    {
        this.Data = CommonHelper.getToday();
    }

    public IdRemetente: number;
    public IdAnexo: number;
    public Data: Date | string;

    public Remetente: Remetente;
    public Anexo: Anexo;
}