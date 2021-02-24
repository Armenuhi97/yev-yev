import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subject } from "rxjs";
import { LoginSendResponse } from "../../core/models/login.model";
import { AuthService } from "./auth.service";
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { CookieService } from "ngx-cookie-service";
import { Router } from "@angular/router";

@Component({
    selector: 'app-auth',
    templateUrl: 'auth.component.html',
    styleUrls: ['auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {
    public loginForm: FormGroup;
    private unsubscribe$ = new Subject<void>();

    constructor(private _fb: FormBuilder,private _authService:AuthService,
        private _router:Router,
        private _cookieService:CookieService) { }

    ngOnInit() {
        this._initForm()
    }
    private _initForm():void {
        this.loginForm = this._fb.group({
            username: ['admin', Validators.required],
            password: ['Gyumri22+', Validators.required]
        })
    }
    public submitForm():void {
        let sendObject:LoginSendResponse={
            username:this.loginForm.get('username').value,
            password:this.loginForm.get('password').value
        }
        this._authService.loginAdmin(sendObject).pipe(takeUntil(this.unsubscribe$)).subscribe((data:{token:string})=>{
            this._cookieService.set('access',data.token);
            this._router.navigate(['/dashboard']);

        })
     }
     ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    
      }
}