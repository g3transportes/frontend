import { Remetente } from './remetente.model';
import { Pedido } from './pedido.model';
import { CommonHelper } from '../helpers/common.helper';

export class RemetenteEstoque
{
    public constructor()
    {
        this.Id = 0;
        this.IdRemetente = 0;
        this.IdPedido = null;
        this.Tipo = '';
        this.Data = CommonHelper.getToday();
        this.Quantidade = 0;
        this.Descricao = '';
        this.Usuario = '';
        this.Transferencia = false;
        this.Ativo = true;
    }

    public Id: number;
    public IdRemetente: number;
    public IdPedido: number | null;
    public Tipo: string;
    public Data: Date | string;
    public Quantidade: number;
    public Descricao: string;
    public Usuario: string;
    public Transferencia: boolean;
    public Ativo: boolean;

    public Remetente: Remetente;
    public Pedido: Pedido;
}