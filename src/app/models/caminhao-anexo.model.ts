import { Caminhao } from './caminhao.model';
import { Anexo } from './anexo.model';
import { CommonHelper } from '../helpers/common.helper';

export class CaminhaoAnexo
{
    public constructor()
    {
        this.Data = CommonHelper.getToday();
    }

    public IdCaminhao: number;
    public IdAnexo: number;
    public Data: Date | string;
    
    public Caminhao: Caminhao;
    public Anexo: Anexo;
}