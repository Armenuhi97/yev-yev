import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";

@Injectable({ providedIn: 'root' })
export class AppService {
    constructor(private _cookieService: CookieService, private _router: Router) { }

    public checkPropertyValue(object: object | Array<any>, element: string | number, returnValue = null) {
        return (object != null && object[element]) ? object[element] : returnValue;
    }
    public logOut(): void {
        this._cookieService.delete('role');
        this._cookieService.delete('access');
        localStorage.removeItem('user')
        this._router.navigate(['/auth'])
    }
}