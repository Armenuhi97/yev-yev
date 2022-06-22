import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotAuthGuard implements CanActivate {
  constructor(private router: Router, private cookieService: CookieService) { }
  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.cookieService.get('access')) {
      this.router.navigate(['/dashboard']);
      return false;
    } else {
      return true;
    }
  }

}
