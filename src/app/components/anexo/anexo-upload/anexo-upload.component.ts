import { Component, OnInit } from '@angular/core';
import { ListResult } from 'src/app/helpers/list-result.helper';
import { Anexo } from 'src/app/models/anexo.model';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogServiceHelper } from 'src/app/services/dialog.service';
import { DialogTypeEnum } from 'src/app/enums/dialog-type.enum';
import { CommonHelper } from 'src/app/helpers/common.helper';

@Component({
	selector: 'app-anexo-upload',
	templateUrl: './anexo-upload.component.html',
	styleUrls: ['./anexo-upload.component.css']
})
export class AnexoUploadComponent implements OnInit 
{
	public uploadedFiles: Array<any> = new Array<any>();
	public url: string = CommonHelper.apiHost('anexo/upload');

	constructor(private ref: DynamicDialogRef, private dialogService: DialogServiceHelper) { }

	ngOnInit(): void {
	}

	public onUpload(event: any)
	{
		let result = <ListResult<Anexo>> event.originalEvent.body;

		if(result != null && result != undefined)
		{
			if(result.IsValid)
			{
				this.ref.close(result);
			}
			else
			{
				this.dialogService.alert('Erro ao enviar os arquivo', result.Errors, DialogTypeEnum.Erro, null);
			}
		}
	}

}
