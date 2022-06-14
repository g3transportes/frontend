import { ClienteAnexo } from './cliente-anexo.model';
import { Pedido } from './pedido.model';
import { Lancamento } from './lancamento.model';

export class Cliente
{
    public constructor()
    {
        this.Id = 0;
        this.RazaoSocial = '';
        this.NomeFantasia = '';
        this.Documento1 = '';
        this.Documento2 = '';
        this.Email = '';
        this.Contato = '';
        this.Telefone1 = '';
        this.Telefone2 = '';
        this.EndRua = '';
        this.EndNumero = '';
        this.EndComplemento = '';
        this.EndBairro = '';
        this.EndCidade = '';
        this.EndEstado = '';
        this.EndCep = '';
        this.BancoNome = '';
        this.BancoAgencia = '';
        this.BancoOperacao = '';
        this.BancoConta = '';
        this.BancoTitular = '';
        this.BancoDocumento = '';
        this.Observacao = '';
        this.Ativo = true;
        this.ValorFreteTonelada = 0;
        this.ValorFreteG3 = 0;

        this.Anexos = new Array<ClienteAnexo>();
        this.Pedidos = new Array<Pedido>();   
        this.Lancamentos = new Array<Lancamento>(); 
    }

    public Id: number;
    public RazaoSocial: string;
    public NomeFantasia: string;
    public Documento1: string;
    public Documento2: string;
    public Email: string;
    public Contato: string;
    public Telefone1: string;
    public Telefone2: string;

    public EndRua: string;
    public EndNumero: string;
    public EndComplemento: string;
    public EndBairro: string;
    public EndCidade: string;
    public EndEstado: string;
    public EndCep: string;

    public BancoNome: string;
    public BancoAgencia: string;
    public BancoOperacao: string;
    public BancoConta: string;
    public BancoTitular: string;
    public BancoDocumento: string;

    public Observacao: string;
    public Ativo: boolean;

    public ValorFreteTonelada: number;
    public ValorFreteG3: number;

    public Anexos: ClienteAnexo[];
    public Pedidos: Pedido[];
    public Lancamentos: Lancamento[];
}