import { Caminhao } from './caminhao.model';
import { Cliente } from './cliente.model';
import { Lancamento } from './lancamento.model';
import { PedidoAnexo } from './pedido-anexo.model';
import { CommonHelper } from '../helpers/common.helper';
import { Remetente } from './remetente.model';
import { RemetenteEstoque } from './remetente-estoque.model';

export class Pedido
{
    public constructor()
    {
        this.Id = 0;
        this.IdCaminhao = null;
        this.IdCliente = 0;
        this.IdRemetente = null;
        
        this.OrdemServico = '';
        this.NumPedido = '';
        this.Destinatario = '';
        this.LocalColeta = '';

        this.DataCriacao = CommonHelper.getToday();
        this.DataColeta = null;
        this.DataEntrega = null;
        this.DataFinalizado = null;
        this.DataPagamento = null;
        this.DataFinalizado = null;
        this.DataDevolucao = null;

        this.Quantidade = 0;
        this.Paletes = 0;
        this.PaletesDevolvidos = 0;
        this.ValorUnitario = 0;
        this.ValorBruto = 0;
        this.ValorLiquido = 0;
        this.ValorPedagio = 0;
        this.ValorDesconto = 0;
        this.ValorAcrescimo = 0;

        this.FreteUnitario = 0;
        this.ValorFrete = 0;

        this.ComissaoUnitario = 0;
        this.ValorComissao = 0;
        this.ComissaoMargem = 0;

        this.ValorPedagioCliente = 0;
        this.ValorPegadioG3 = 0;
        
        this.Observacao = '';
        this.Coletado = false;
        this.Entregue = false;
        this.Pago = false;
        this.Finalizado = false;
        this.Devolvido = false;
        this.Ativo = true;

        this.CTe = '';
        this.NFe = '';
        this.Boleto = '';

        this.Anexos = new Array<PedidoAnexo>();
        this.Lancamentos = new Array<Lancamento>();
        this.Estoques = new Array<RemetenteEstoque>();
    }

    public Id: number;
    public IdCaminhao: number | null;
    public IdCliente: number;
    public IdRemetente: number | null;

    public OrdemServico: string;
    public NumPedido: string;
    public Destinatario: string;
    public LocalColeta: string;

    public DataCriacao: Date | string;
    public DataColeta: Date | string | null;
    public DataEntrega: Date | string | null;
    public DataFinalizado: Date | string | null;
    public DataPagamento: Date | string | null;
    public DataDevolucao: Date | string | null;
    
    public Quantidade: number;
    public Paletes: number;
    public PaletesDevolvidos: number;
    public ValorUnitario: number;
    public ValorBruto: number;
    public ValorLiquido: number;
    public ValorPedagio: number;
    public ValorAcrescimo: number;
    public ValorDesconto: number;


    public FreteUnitario: number;
    public ValorFrete: number;

    public ComissaoUnitario: number;
    public ValorComissao: number;
    public ComissaoMargem: number;

    public ValorPedagioCliente: number;
    public ValorPegadioG3: number;

    public Observacao: string;
    public Coletado: boolean;
    public Entregue: boolean;
    public Pago: boolean;
    public Finalizado: boolean;
    public Devolvido: boolean;
    public Ativo: boolean;

    public CTe: string;
    public NFe: string;
    public Boleto: string;

    public Caminhao: Caminhao;
    public Cliente: Cliente;
    public Remetente: Remetente;
    public Anexos: PedidoAnexo[];
    public Lancamentos: Lancamento[];
    public Estoques: RemetenteEstoque[];
}