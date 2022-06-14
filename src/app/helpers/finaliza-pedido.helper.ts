import { Pedido } from '../models/pedido.model';
import { Lancamento } from '../models/lancamento.model';

export class FinalizaPedido
{
    public constructor()
    {
        this.Pedido = new Pedido();
        this.Lancamentos = new Array<Lancamento>();
    }

    public Pedido: Pedido;
    public Lancamentos: Lancamento[];
}