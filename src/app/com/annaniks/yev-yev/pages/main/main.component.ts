import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: 'app-main',
    templateUrl: 'main.component.html',
    styleUrls: ['main.component.scss']
})
export class MainComponent {
    public tabs = [
        { title: 'Վարորդներ', path:  '/dashboard/driver' },
        { title: 'Ուղևորներ', path: '/dashboard/user' },
        { title: 'Ուղղություններ', path: '#' },
        { title: 'Աշխատակիցներ', path: '/dashboard/moderator' },
        { title: 'Պատվերներ', path: '#' },
        { title: 'Կարգավորումներ', path: '/dashboard/settings' },

    ]
    constructor(private _router: Router) { }

}