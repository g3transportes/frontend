import { Pedido } from './pedido.model';
import { RemetenteAnexo } from './remetente-anexo.model';
import { RemetenteEstoque } from './remetente-estoque.model';
import { Anexo } from './anexo.model';

export class Remetente
{
    public constructor()
    {
        this.Pedidos = new Array<Pedido>();
        this.Anexos = new Array<RemetenteAnexo>();

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
        this.EstoqueAtual = 0;
        this.Ativo = true;

        this.Pedidos = new Array<Pedido>();
        this.Anexos = new Array<RemetenteAnexo>();
        this.Estoques = new Array<RemetenteEstoque>();
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
    public EstoqueAtual: number;
    public Ativo: boolean;

    public Pedidos: Pedido[];
    public Anexos: RemetenteAnexo[];
    public Estoques: RemetenteEstoque[];
}