import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private _cookieService: CookieService,private _router:Router) { }

    canActivate(): Observable<boolean> | Promise<boolean> | boolean {
        if (this._cookieService.get('access')) {
            return true;
        } else {
            this._router.navigate(['/auth'])
            return false
        }
    }
}
