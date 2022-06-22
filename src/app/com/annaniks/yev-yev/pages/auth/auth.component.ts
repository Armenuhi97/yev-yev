import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EMPTY, Subject, throwError } from "rxjs";
import { LoginSendResponse } from "../../core/models/login.model";
import { AuthService } from "./auth.service";
import { catchError, takeUntil } from 'rxjs/operators';
import { CookieService } from "ngx-cookie-service";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
    selector: 'app-auth',
    templateUrl: 'auth.component.html',
    styleUrls: ['auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {
    public loginForm: FormGroup;
    private unsubscribe$ = new Subject<void>();
    errorMessage: string = ''
    constructor(private _fb: FormBuilder, private _authService: AuthService,
        private _router: Router,
        private _cookieService: CookieService) { }

    ngOnInit() {
        this._initForm()
    }
    private _initForm(): void {
        // admin
        // Gyumri22+
        this.loginForm = this._fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        })
        this.loginForm.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
            this.errorMessage = ''
        })
    }
    public submitForm(): void {
        this.errorMessage = '';
        const sendObject: LoginSendResponse = {
            username: this.loginForm.get('username').value,
            password: this.loginForm.get('password').value
        };
        this._authService.loginAdmin(sendObject).pipe(takeUntil(this.unsubscribe$),
            catchError((error: HttpErrorResponse) => {
                if (error && error.error && error.error.message) {
                    this.errorMessage = 'Սխալ մուտքանուն կամ գաղտնաբառ';
                }
                return throwError(error);
            })).subscribe((data: any) => {
                this._cookieService.set('access', data.token);
                this._cookieService.set('role', data.role_code);
                localStorage.setItem('user', JSON.stringify(data.user.user));
                this._router.navigate(['/dashboard']);

            });
    }
    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();

    }
}