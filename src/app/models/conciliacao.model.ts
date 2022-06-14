import { ContaBancaria } from './conta-bancaria.model';
import { CommonHelper } from '../helpers/common.helper';

export class Conciliacao
{
    public constructor()
    {
        this.Id = 0;
        this.IdConta = 0;
        this.Data = CommonHelper.getToday();
        this.Saldo = 0;
        this.Anexo = '';
    }

    public Id: number;
    public IdConta: number;
    public Data: Date | string;
    public Saldo: number;
    public Anexo: string;

    public Conta: ContaBancaria;
}