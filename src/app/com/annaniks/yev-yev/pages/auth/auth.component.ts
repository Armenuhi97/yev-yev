import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: 'app-auth',
    templateUrl: 'auth.component.html',
    styleUrls: ['auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {
    public loginForm: FormGroup;
    constructor(private _fb: FormBuilder) { }

    ngOnInit() {
        this._initForm()
    }
    private _initForm() {
        this.loginForm = this._fb.group({
            email: [null, Validators.required],
            password: [null, Validators.required]
        })
    }
    public submitForm() { }
    ngOnDestroy() { }
}