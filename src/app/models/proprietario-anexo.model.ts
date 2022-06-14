import { Proprietario } from './proprietario.model';
import { Anexo } from './anexo.model';
import { CommonHelper } from '../helpers/common.helper';

export class ProprietarioAnexo
{
    public constructor()
    {
        this.Data = CommonHelper.getToday();
    }

    public IdProprietario: number;
    public IdAnexo: number;
    public Data: Date | string;

    public Proprietario: Proprietario;
    public Anexo: Anexo;
}