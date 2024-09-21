import { Component } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd/message";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Messages } from "../../core/models/mesages";
import { PasswordValidation } from "../../core/utilities/validators";
import { ModeratorSettingsService } from "./moderator-settings․service";

@Component({
    selector: 'app-moderator-settings',
    templateUrl: 'moderator-settings.component.html',
    styleUrls: ['moderator-settings.component.scss']
})
export class ModeratorSettingsComponent {
    public validateForm: FormGroup;
    private unsubscribe$ = new Subject<void>();
    userName = new FormControl(null, [Validators.required, Validators.minLength(6)])
    myEntity;
    constructor(private _fb: FormBuilder, private _moderatorSettingsService: ModeratorSettingsService,
        private nzMessages: NzMessageService,
    ) {
        this.myEntity = JSON.parse(localStorage.getItem('user'));
        this.userName.setValue(this.myEntity?.username)
    }

    ngOnInit() {
        this.iniForm()
    }

    iniForm() {
        this.validateForm = this._fb.group({
            oldPassword: [null, Validators.required],
            password: [null, [Validators.required,Validators.minLength(6)]],
            repeatPassword: [null, [Validators.required]]
        },
            { validator: PasswordValidation.MatchPassword })
    }


    public changeUserName() {
        this._moderatorSettingsService.changeUserName(this.myEntity.id, { username: this.userName.value }).pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
            this.nzMessages.success(Messages.success);
            this.myEntity.username=this.userName.value;            
            localStorage.setItem('user',JSON.stringify(this.myEntity))
        },
            () => {
                this.nzMessages.error(Messages.fail)
            })
    }
    public changePassword() {
        
        if (this.validateForm.valid) {
            let sendRequest = {
                "old_password": this.validateForm.get('oldPassword').value,
                "new_password": this.validateForm.get('password').value,
                "repeat_password": this.validateForm.get('repeatPassword').value
            }
            this._moderatorSettingsService.changePassword(this.myEntity.id, sendRequest).pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
                this.nzMessages.success(Messages.success)
            },
                (err) => {
                    this.nzMessages.error(Messages.fail)
                })
        }
    }
    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}