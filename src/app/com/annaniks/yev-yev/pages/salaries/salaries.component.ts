import { Component, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd/message";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Messages } from "../../core/models/mesages";
import { SalaryRespone, User } from "../../core/models/salary";
import { ServerResponce } from "../../core/models/server-reponce";
import { MainService } from "../main/main.service";
import { SalaryService } from "./salaries.service";

@Component({
    selector: 'app-salaries',
    templateUrl: 'salaries.component.html',
    styleUrls: ['salaries.component.scss']
})
export class SalariesComponent {
    salaryTable: User[] = []
    pageSize: number = 10;
    unsubscribe$ = new Subject();
    total: number;
    pageIndex: number = 1;
    isEditing: boolean = false;
    isVisible: boolean = false;
    validateForm: FormGroup;
    editIndex: number = null;

    constructor(private _salaryService: SalaryService,
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
            phone_number: [null, Validators.required],
            username: [null, [Validators.required, Validators.minLength(6)]]

        })
    }
    public changeUserStatus($event, id: number) {
        this._salaryService.editUser(id, { is_active: $event }).pipe(takeUntil(this.unsubscribe$)).subscribe()
    }
    public getUsers() {
        this._salaryService.getUsers(this.pageIndex).pipe(takeUntil(this.unsubscribe$)).subscribe((data: ServerResponce<User[]>) => {
            this.total = data.count;
            this.salaryTable = data.results;
        })
    }

    onEditsalary(index: number) {
        this.isEditing = true;
        this.editIndex = index;
        this.getsalaryById(this.salaryTable[this.editIndex].id);
        this.showModal()
    }
    public getsalaryById(id: number) {
        this._salaryService.getUserById(id).pipe(takeUntil(this.unsubscribe$)).subscribe((data: ServerResponce<User>) => {
            if(data.results && data.results[0]) {
                let item = data.results[0]
                this.validateForm.patchValue({
                    first_name: item.user.first_name,
                    last_name: item.user.last_name,
                    phone_number: item.phone_number,
                    username: item.user.username
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
    public onsalarySave() {
        if (this.validateForm.invalid) {
            this.nzMessages.error(Messages.fail);
            return;
        }

        let sendObject: SalaryRespone = {
            "first_name": this.validateForm.get('first_name').value,
            "last_name": this.validateForm.get('last_name').value,
            "phone_number": this.validateForm.get('phone_number').value,
            "image": '',
            "username": this.validateForm.get('username').value,
        }

        this.sendRequest(sendObject);


    }
    sendRequest(sendObject) {
        if (this.editIndex == null) {
            this._salaryService.addUser(sendObject).pipe(takeUntil(this.unsubscribe$)).subscribe((data: User) => {
                this.nzMessages.success(Messages.success)

                this.closeModal();
                if (this.salaryTable.length == 10) {
                    this.pageIndex += 1
                }
                this.getUsers()
            },
                () => {
                    this.nzMessages.error(Messages.fail)
                })
        } else {
            this._salaryService.editUser(this.salaryTable[this.editIndex].id, sendObject).pipe(takeUntil(this.unsubscribe$)).subscribe((data: SalaryRespone) => {
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