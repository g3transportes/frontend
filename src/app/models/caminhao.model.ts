import { CaminhaoAnexo } from './caminhao-anexo.model';
import { Motorista } from './motorista.model';
import { Pedido } from './pedido.model';
import { Lancamento } from './lancamento.model';
import { Proprietario } from './proprietario.model';

export class Caminhao
{
    public constructor()
    {
        this.Id = 0;
        this.IdMotorista = null;
        this.IdProprietario = null;
        this.Nome = '';
        this.Placa = '';
        this.Placa2 = '';
        this.Placa3 = '';
        this.Placa4 = '';
        this.Modelo = '';
        this.Renavam = '';
        this.Renavam2 = '';
        this.Renavam3 = '';
        this.Renavam4 = '';
        this.Cidade = 'Lavras';
        this.Estado = 'MG';
        this.Capacidade = 0;
        this.Ativo = true;

        this.Anexos = new Array<CaminhaoAnexo>();
        this.Pedidos = new Array<Pedido>();
        this.Lancamentos = new Array<Lancamento>();
    }

    public Id: number;
    public IdMotorista: number | null;
    public IdProprietario: number | null;
    public Nome: string;
    public Modelo: string;
    public Capacidade: number;
    public Ativo: boolean;

    public Placa: string;
    public Placa2: string;
    public Placa3: string;
    public Placa4: string;
    public Renavam: string;
    public Renavam2: string;
    public Renavam3: string;
    public Renavam4: string;
    public Cidade: string;
    public Estado: string;

    public Motorista: Motorista;
    public Proprietario: Proprietario;
    public Anexos: CaminhaoAnexo[];
    public Pedidos: Pedido[];
    public Lancamentos: Lancamento[];
}