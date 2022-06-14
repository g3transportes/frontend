export class CommonHelper
{
    public static apiHost(endpoint: string): string
    {
    	 return 'https://api-g3transportes.ecolinx.com.br/' + endpoint;
        //return 'https://api-g3finan.ecolinx.com.br/' + endpoint;
        //return 'https://localhost:44320/' + endpoint;
    }


    public static roundDouble(valor: number): number
    {
        return Math.round(valor * 100) / 100
    }

    public static getToday(): Date
    {
        let year = new Date().getFullYear();
        let month = new Date().getMonth();
        let day = new Date().getDate();

        return new Date(year, month, day, 0, 0, 0);
    }

    public static getNow(): Date
    {
        let year = new Date().getFullYear();
        let month = new Date().getMonth();
        let day = new Date().getDate();
        let hour = new Date().getHours() - 3;
        let minutes = new Date().getMinutes();

        return new Date(year, month, day, hour, minutes, 0);
    }

    public static setDate(data: Date | string): Date
    {
        if(data != null)
        {
            data = new Date(data);

            let year = data.getFullYear();
            let month = data.getMonth();
            let day = data.getDate();

            return new Date(year, month, day, 0, 0, 0);
        }
        else
        {
            return null;
        }
    }

    public static calendarLocale(): any
    {
        let ptBr =
        {
            firstDayOfWeek: 0,
            dayNames: ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"],
            dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
            dayNamesMin: ["Do","Se","Te","Qa","Qi","Se","Sa"],
            monthNames: [ "Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro" ],
            monthNamesShort: [ "Jan", "Fev", "Mar", "Abr", "Mai", "Jun","Jul", "Ago", "Set", "Out", "Nov", "Dez" ],
            today: 'Hoje',
            clear: 'Limpar',
            dateFormat: 'dd/mm/yyyy',
            weekHeader: 'Sem'
        };

        return ptBr;
    }
}
