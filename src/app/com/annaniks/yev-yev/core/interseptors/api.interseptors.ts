import { HttpInterceptor, HttpRequest, HttpEvent, HttpHandler, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { catchError } from 'rxjs/operators';
import { AppService } from '../services/app.service';
import { throwError } from 'rxjs';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

    constructor(
        @Inject('BASE_URL') private baseUrl: string,
        private cookieService: CookieService,
        private _appService: AppService
    ) { }
    private _checkIsRelativePath(url: string): boolean {
        return url.startsWith('/assets') || url.startsWith('http://') || url.startsWith('https://')
    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (req.headers.get('skip')) {
            return next.handle(req);
        }
        let params: HttpParams = (req.params) ? req.params : new HttpParams();
        let headers: HttpHeaders = (req.headers) ? req.headers : new HttpHeaders();
        const url = this._checkIsRelativePath(req.url) ? `${req.url}` : `${this.baseUrl}${req.url}`;

        if (req.url !== 'login/login/')
            headers = headers.append('Authorization', 'Token ' + this.cookieService.get('access'));

        if (params.has('authorization')) {
            params = params.delete('authorization');
        }
        const clonedReq = req.clone({
            url,
            headers,
            params
        });
        return next.handle(clonedReq)
            // .pipe(
            //     catchError((error: any) => {
            //         if (error instanceof HttpErrorResponse) {
            //             // 401 error
            //             if (error.status === 401) {
            //                 this._appService.logOut();
            //             }
            //             // 403 error
            //             if (error.status === 403) {
            //                 this._appService.logOut();
            //             }
            //         }
            //         return throwError(() => error);
            //     }),
            // );
            .pipe(
                catchError((error: any) => {
                    if (error instanceof HttpErrorResponse) {
                        // 401 error
                        if (error.status === 401) {
                            this._appService.logOut();
                        }
                        // 403 error
                        if (error.status === 403) {
                            this._appService.logOut();
                        }
                    }
                    return throwError(error);
                }),
            );
    }
}
