import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: 'app-main',
    templateUrl: 'main.component.html',
    styleUrls: ['main.component.scss']
})
export class MainComponent {
    public tabs = [
        { title: 'Վարորդներ', path: '#' },
        { title: 'Ուղևորներ', path: '#' },
        { title: 'Ուղղություններ', path: '#' },
        { title: 'Աշխատակիցներ', path: '/dashboard/salary' },
        { title: 'Պատվերներ', path: '#' },
        { title: 'Կարգավորումներ', path: '/dashboard/settings' },

    ]
    constructor(private _router: Router) { }

}