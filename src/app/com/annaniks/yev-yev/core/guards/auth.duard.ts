import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private _cookieService: CookieService) { }

    canActivate(): Observable<boolean> | Promise<boolean> | boolean {
        if (this._cookieService.get('access')) {
            return true;
        } else {
            return false
        }
    }
}
