import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd/message";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Messages } from "../../core/models/mesages";
import { Client } from "../../core/models/salary";
import { ServerResponce } from "../../core/models/server-reponce";
import { MainService } from "../main/main.service";
import { UsersService } from "./users.service";

@Component({
    selector: 'app-users',
    templateUrl: 'users.component.html',
    styleUrls: ['users.component.scss']
})
export class UsersComponent {
    clientTable: Client[] = []
    pageSize: number = 10;
    unsubscribe$ = new Subject();
    total: number;
    pageIndex: number = 1;
    isEditing: boolean = false;
    isVisible: boolean = false;
    validateForm: FormGroup;
    editIndex: number = null;

    constructor(private _userService: UsersService,
        private nzMessages: NzMessageService,
        private _mainService: MainService,
        private _fb: FormBuilder) {
    }

    ngOnInit() {
        this._initForm();
        this.getUsers()
    }
    private _initForm() {
        this.validateForm = this._fb.group({
            first_name: [null, Validators.required],
            last_name: [null, Validators.required],
            phone_number: [null, Validators.required]
        })
    }
    public changeUserStatus($event, id: number) {
        this._userService.editUser(id, { is_active: $event }).pipe(takeUntil(this.unsubscribe$)).subscribe()
    }
    public getUsers() {
        this._userService.getUsers(this.pageIndex).pipe(takeUntil(this.unsubscribe$)).subscribe((data: ServerResponce<Client[]>) => {
            this.total = data.count;
            this.clientTable = data.results;
        })
    }

    onEditclient(index: number) {
        this.isEditing = true;
        this.editIndex = index;
        this.getclientById(this.clientTable[this.editIndex].id);
        this.showModal()
    }
    public getclientById(id: number) {
        this._userService.getUserById(id).pipe(takeUntil(this.unsubscribe$)).subscribe((data: ServerResponce<Client>) => {
            if (data.results && data.results[0]) {
                let item = data.results[0]
                this.validateForm.patchValue({
                    first_name: item.user.first_name,
                    last_name: item.user.last_name,
                    phone_number: item.phone_number,
                })
            }
        })

    }
    public showModal(): void {
        this.isVisible = true;
    }
    handleCancel(): void {
        this.isVisible = false;
        this.isEditing = false;
        this.validateForm.reset();
        this.editIndex = null
    }
    nzPageIndexChange(page: number) {
        this.pageIndex = page;
        this.getUsers()
    }
    public onclientSave() {
        if (this.validateForm.invalid) {
            this.nzMessages.error(Messages.fail);
            return;
        }

        let sendObject = {
            "first_name": this.validateForm.get('first_name').value,
            "last_name": this.validateForm.get('last_name').value,
            "phone_number": this.validateForm.get('phone_number').value,
            "image": '',
        }

        this.sendRequest(sendObject);


    }
    sendRequest(sendObject) {
        if (this.editIndex == null) {
            this._userService.addUser(sendObject).pipe(takeUntil(this.unsubscribe$)).subscribe((data: Client) => {
                this.nzMessages.success(Messages.success)
                this.closeModal();
                this.pageIndex = 1
                this.getUsers()
            },
                () => {
                    this.nzMessages.error(Messages.fail)
                })
        } else {
            this._userService.editUser(this.clientTable[this.editIndex].id, sendObject).pipe(takeUntil(this.unsubscribe$)).subscribe((data: any) => {
                this.getUsers()

                this.nzMessages.success(Messages.success)
                this.closeModal()
            },
                () => {
                    this.nzMessages.error(Messages.fail)
                })
        }
    }
    closeModal(): void {
        this.isVisible = false;
        this.validateForm.reset();
        this.editIndex = null
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}