import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";

@Injectable({ providedIn: 'root' })
export class AppService {
    constructor(private cookieService: CookieService, private router: Router) { }

    public checkPropertyValue(object: object | Array<any>, element: string | number, returnValue = null) {
        return (object != null && object[element]) ? object[element] : returnValue;
    }
    public logOut(): void {
        this.cookieService.delete('role');
        this.cookieService.delete('access');
        localStorage.removeItem('user')
        this.router.navigate(['/auth'])
    }
    openNewTab(url: string, id): void {
        const urlTree = this.router.createUrlTree([url, id]);
        // window.open(url.toString(), '_blank')
        const a = document.createElement('a');
        a.target = '_blank';
        a.href = urlTree.toString();
        a.click();
    }
}