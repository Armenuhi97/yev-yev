import { HttpInterceptor, HttpRequest, HttpEvent, HttpHandler, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

    constructor(
        @Inject('BASE_URL') private baseUrl: string,
        private cookieService: CookieService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (req.headers.get('skip')) {
            return next.handle(req);
        }
        let params: HttpParams = (req.params) ? req.params : new HttpParams();
        let headers: HttpHeaders = (req.headers) ? req.headers : new HttpHeaders();
        const url = `${this.baseUrl}${req.url}`;
        headers = headers.append('Authorization', 'Token ' + this.cookieService.get('access'));
      // if (!params.has('authorization') || (params.has('authorization') && params.get('authorization') === 'true')) {
      //       const accessToken: string = this.cookieService.get('accessToken') || '';
      //       // if (accessToken) {
      //       // }
      //   }
        if (params.has('authorization')) {
            params = params.delete('authorization');
        }
        const clonedReq = req.clone({
            url,
            headers,
            params
        });
        return next.handle(clonedReq);
    }
}
