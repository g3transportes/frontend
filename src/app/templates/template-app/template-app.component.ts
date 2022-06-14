import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';

@Component({
	selector: 'app-template-app',
	templateUrl: './template-app.component.html',
	styleUrls: ['./template-app.component.css']
})
export class TemplateAppComponent implements OnInit 
{

	constructor(public globalService: GlobalService) 
	{ 

	}

	ngOnInit() {
	}

}
