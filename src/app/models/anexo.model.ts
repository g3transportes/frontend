import { CaminhaoAnexo } from './caminhao-anexo.model';
import { ClienteAnexo } from './cliente-anexo.model';
import { MotoristaAnexo } from './motorista-anexo.model';
import { PedidoAnexo } from './pedido-anexo.model';
import { LancamentoAnexo } from './lancamento-anexo.model';
import { ProprietarioAnexoFilter } from '../filters/proprietario-anexo.filter';
import { ProprietarioAnexo } from './proprietario-anexo.model';
import { RemetenteAnexo } from './remetente-anexo.model';

export class Anexo
{
    public constructor()
    {
        this.Caminhoes = new Array<CaminhaoAnexo>();
        this.Clientes = new Array<ClienteAnexo>();
        this.Motoristas = new Array<MotoristaAnexo>();
        this.Pedidos = new Array<PedidoAnexo>();
        this.Lancamentos = new Array<LancamentoAnexo>();
        this.Proprietarios = new Array<ProprietarioAnexo>();
        this.Remetentes = new Array<RemetenteAnexo>();
    }

    public Id: number;
    public Nome: string;
    public Arquivo: string;

    public Caminhoes: CaminhaoAnexo[];
    public Clientes: ClienteAnexo[];
    public Motoristas: MotoristaAnexo[];
    public Pedidos: PedidoAnexo[];
    public Lancamentos: LancamentoAnexo[];
    public Proprietarios: ProprietarioAnexo[];
    public Remetentes: RemetenteAnexo[];
}