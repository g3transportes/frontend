export class Configuracao
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
        this.Logomarca = '';
        this.EndRua = '';
        this.EndNumero = '';
        this.EndComplemento = '';
        this.EndBairro = '';
        this.EndCidade = '';
        this.EndEstado = '';
        this.EndCep = '';
        this.SmtpHost = '';
        this.SmtpUsuario = '';
        this.SmtpSenha = '';
        this.SmtpPorta = 587;
        this.SmtpSSL = true
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
    public Logomarca: string;
    public EndRua: string;
    public EndNumero: string;
    public EndComplemento: string;
    public EndBairro: string;
    public EndCidade: string;
    public EndEstado: string;
    public EndCep: string;
    public SmtpHost: string;
    public SmtpUsuario: string;
    public SmtpSenha: string;
    public SmtpPorta: number;
    public SmtpSSL: boolean;
}