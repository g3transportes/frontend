import { MotoristaAnexo } from './motorista-anexo.model';
import { Caminhao } from './caminhao.model';

export class Motorista
{
    public constructor()
    {
        this.Id = 0;
        this.Nome = '';
        this.Documento1 = '';
        this.Documento2 = '';
        this.Documento3 = '';
        this.Telefone1 = '';
        this.Telefone2 = '';
        this.Telefone3 = '';
        this.Email = '';
        this.Ativo = true;

        this.Categoria = '';
        this.DataVencimento = null;
        this.DataVencimento = null;
        this.EndRua = '';
        this.EndNumero = '';
        this.EndComplemento = '';
        this.EndBairro = '';
        this.EndCidade = '';
        this.EndEstado = '';
        this.EndCep = '';
        this.Observacao = '';
        this.BancoNome = '';
        this.BancoAgencia = '';
        this.BancoOperacao = '';
        this.BancoConta = '';
        this.BancoTitular = '';
        this.BancoDocumento = '';

        this.Caminhoes = new Array<Caminhao>();
        this.Anexos = new Array<MotoristaAnexo>();
    }

    public Id: number;
    public Nome: string;
    public Documento1: string;
    public Documento2: string;
    public Documento3: string;
    public Telefone1: string;
    public Telefone2: string;
    public Telefone3: string;
    public Email: string;
    public Ativo: boolean;

    public Categoria: string;
    public DataHabilitacao: Date | string | null;
    public DataVencimento: Date | string | null;
    public EndRua: string;
    public EndNumero: string;
    public EndComplemento: string;
    public EndBairro: string;
    public EndCidade: string;
    public EndEstado: string;
    public EndCep: string;
    public Observacao: string;

    public BancoNome: string;
    public BancoAgencia: string;
    public BancoOperacao: string;
    public BancoConta: string;
    public BancoTitular: string;
    public BancoDocumento: string;

    public Anexos: MotoristaAnexo[];
    public Caminhoes: Caminhao[];
}