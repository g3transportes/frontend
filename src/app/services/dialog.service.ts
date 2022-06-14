import { Injectable } from '@angular/core';
import { DialogTypeEnum } from '../enums/dialog-type.enum';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
	providedIn: 'root'
})
export class DialogServiceHelper 
{

	constructor() 
	{ 

	}

	public alert(pTitle: string, pMessage: string[], pType: DialogTypeEnum, pCallback: any): void
    {
		let stringMessage = '';
		
		pMessage.forEach((err) => {
            stringMessage += "- " + err + "<br>";
		});
		
		let type: SweetAlertIcon = 'info';
		switch (pType) {
			case DialogTypeEnum.Sucesso:
				type = "success";
				break;
			case DialogTypeEnum.Erro:
				type = "error";
				break;
			case DialogTypeEnum.Info:
				type = "info";
				break;
			case DialogTypeEnum.Warning:
				type = "warning";
				break;
			default:
				type = "info";
				break;
        }
        
        Swal.fire(
        { 
            title: pTitle,
            html: stringMessage,
            icon: type,
            showCancelButton: false,
            showCloseButton: false,
            showConfirmButton: true,
            confirmButtonColor: '#ff5d16',
            confirmButtonText: 'OK'
        })
        .then((result) =>
        {
            if (result.value) 
            {
                if(pCallback != null)
					pCallback();
            }
        });
	}
	
	public confirm(pTitle: string, pMessage: string, acceptCallback: any, rejectCallback: any): void
    {
		Swal.fire(
		{
			title: pTitle,
			text: pMessage,
			icon: "question",
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#4f4f4f',
			confirmButtonText: 'Sim',
			cancelButtonText: 'Não'
		})
		.then((result) => 
		{
			if (result.value) 
			{
				if(acceptCallback != null)
					acceptCallback();
			}
			else
			{
				if(rejectCallback != null)
					rejectCallback();
			}
		});
    }
}