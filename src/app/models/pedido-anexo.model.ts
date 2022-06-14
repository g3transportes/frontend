import { Pedido } from './pedido.model';
import { Anexo } from './anexo.model';
import { CommonHelper } from '../helpers/common.helper';

export class PedidoAnexo
{
    public constructor()
    {
        this.Data = CommonHelper.getToday();
    }

    public IdPedido: number;
    public IdAnexo: number;
    public Data: Date | string;

    public Pedido: Pedido;
    public Anexo: Anexo;
}