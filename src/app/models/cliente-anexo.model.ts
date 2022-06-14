import { Cliente } from './cliente.model';
import { Anexo } from './anexo.model';
import { CommonHelper } from '../helpers/common.helper';

export class ClienteAnexo
{
    public constructor()
    {
        this.Data = CommonHelper.getToday();
    }
    
    public IdCliente: number;
    public IdAnexo: number;
    public Data: Date | string;

    public Cliente: Cliente;
    public Anexo: Anexo;
}