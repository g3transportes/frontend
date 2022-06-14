import { Motorista } from './motorista.model';
import { Anexo } from './anexo.model';
import { CommonHelper } from '../helpers/common.helper';

export class MotoristaAnexo
{
    public constructor()
    {
        this.Data = CommonHelper.getToday();
    }

    public IdMotorista: number;
    public IdAnexo: number;
    public Data: Date | string;

    public Motorista: Motorista;
    public Anexo: Anexo;
}