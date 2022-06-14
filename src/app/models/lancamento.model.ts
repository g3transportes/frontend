import { Pedido } from './pedido.model';
import { Cliente } from './cliente.model';
import { Caminhao } from './caminhao.model';
import { FormaPagamento } from './forma-pagamento.model';
import { CommonHelper } from '../helpers/common.helper';
import { LancamentoAnexo } from './lancamento-anexo.model';
import { LancamentoBaixa } from './lancamento-baixa.model';
import { ContaBancaria } from './conta-bancaria.model';
import { CentroCusto } from './centro-custo.model';
import { TipoDocumento } from './tipo-documento.model';

export class Lancamento
{
    public constructor()
    {
        this.Id = 0;
        this.IdPedido = null;
        this.IdCliente = null;
        this.IdCaminhao = null;
        this.IdFormaPagamento = 0;
        this.IdContaBancaria = null;
        this.IdCentroCusto = null;
        this.IdTipoDocumento = null;
        this.Tipo = 'C';
        this.Favorecido = '';
        this.DataEmissao = CommonHelper.getToday();
        this.DataVencimento = CommonHelper.getToday();
        this.DataBaixa = null;
        this.ValorBruto = 0;
        this.ValorDesconto = 0;
        this.ValorAcrescimo = 0;
        this.ValorLiquido = 0;
        this.ValorBaixado = 0;
        this.ValorSaldo = 0;
        this.Observacao = '';
        this.BancoNome = '';
        this.BancoAgencia = '';
        this.BancoOperacao = '';
        this.BancoConta = '';
        this.BancoTitular = '';
        this.BancoDocumento = '';
        this.Baixado = false;
        this.Autorizado = false;
        this.DataAutorizacao = null;
        this.UsuarioAutorizacao = '';


        this.Anexos = new Array<LancamentoAnexo>();
        this.Baixas = new Array<LancamentoBaixa>();
    }

    public Id: number;
    public IdPedido: number | null;
    public IdCliente: number | null;
    public IdCaminhao: number | null;
    public IdFormaPagamento: number;
    public IdContaBancaria: number | null;
    public IdCentroCusto: number | null;
    public IdTipoDocumento: number | null;
    public Tipo: string;
    public Favorecido: string;
    public DataEmissao: Date | string;
    public DataVencimento: Date | string;
    public DataBaixa: Date | string | null;
    public ValorBruto: number;
    public ValorDesconto: number;
    public ValorAcrescimo: number;
    public ValorLiquido: number;
    public ValorBaixado: number;
    public ValorSaldo: number;
    public Observacao: string;
    public Baixado: boolean;

    public Autorizado: boolean;
    public DataAutorizacao: Date | string | null;
    public UsuarioAutorizacao: string;

    public BancoNome: string;
    public BancoAgencia: string;
    public BancoOperacao: string;
    public BancoConta: string;
    public BancoTitular: string;
    public BancoDocumento: string;

    public Pedido: Pedido;
    public Cliente: Cliente;
    public Caminhao: Caminhao;
    public FormaPagamento: FormaPagamento;
    public ContaBancaria: ContaBancaria;
    public CentroCusto: CentroCusto;
    public TipoDocumento: TipoDocumento;

    public Anexos: LancamentoAnexo[];
    public Baixas: LancamentoBaixa[];
}