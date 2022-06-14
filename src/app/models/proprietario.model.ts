import { Caminhao } from './caminhao.model';
import { CommonHelper } from '../helpers/common.helper';
import { ProprietarioAnexo } from './proprietario-anexo.model';

export class Proprietario
{
    public constructor()
    {
        this.Id = 0;
        this.Nome = '';
        this.Documento = '';
        this.Documento2 = '';
        this.Antt = '';
        this.AnttData = CommonHelper.getToday();
        this.Tipo = '';
        this.Pis = '';
        this.Filiacao = '';
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

        this.Caminhoes = new Array<Caminhao>();
        this.Anexos = new Array<ProprietarioAnexo>();
    }

    public Id: number;
    public Nome: string;
    public Documento: string;
    public Documento2: string;
    public Antt: string;
    public AnttData: Date | string | null;
    public Tipo: string;
    public Pis: string;
    public Filiacao: string;
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

    public Caminhoes: Caminhao[];
    public Anexos: ProprietarioAnexo[];
}