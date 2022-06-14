import { Lancamento } from './lancamento.model';
import { Anexo } from './anexo.model';
import { CommonHelper } from '../helpers/common.helper';

export class LancamentoAnexo
{
    public constructor()
    {
        this.Data = CommonHelper.getToday();
    }

    public IdLancamento: number;
    public IdAnexo: number;
    public Data: Date | string;

    public Lancamento: Lancamento;
    public Anexo: Anexo;
}