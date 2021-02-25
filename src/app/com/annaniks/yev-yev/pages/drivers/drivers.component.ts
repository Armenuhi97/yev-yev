import { Component } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd/message";
import { forkJoin, Subject } from "rxjs";
import { map, switchMap, takeUntil } from "rxjs/operators";
import { Messages } from "../../core/models/mesages";
import { RouteItem } from "../../core/models/routes.model";
import { SalaryRespone, User } from "../../core/models/salary";
import { ServerResponce } from "../../core/models/server-reponce";
import { MainService } from "../main/main.service";
import { DriverService } from "./drivers.service";
@Component({
    selector: 'app-drivers',
    templateUrl: 'drivers.component.html',
    styleUrls: ['drivers.component.scss']
})
export class DriversComponent {
    salaryTable: User[] = []
    pageSize: number = 10;
    unsubscribe$ = new Subject();
    total: number;
    pageIndex: number = 1;
    isEditing: boolean = false;
    isVisible: boolean = false;
    validateForm: FormGroup;
    editIndex: number = null;
    routes: RouteItem[] = []
    constructor(private _driavesService: DriverService,
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
            username: [null, [Validators.required, Validators.minLength(6)]],
            car_model: [null, Validators.required],
            car_color: [null, Validators.required],
            car_number: [null, Validators.required],
            car_capacity: [null, Validators.required],
        })
    }

    public getAllRoutes() {
        return this._driavesService.getAllRoutes().pipe(map((data: ServerResponce<RouteItem[]>) => {
            this.total = data.count;
            this.routes = data.results;
            return data
        }))
    }
    private _combineObsevable() {
        const combine = forkJoin(
            this.getAllRoutes(),
        )
        return combine
    }
    public getUsers() {
        this._driavesService.getUsers(this.pageIndex).pipe(takeUntil(this.unsubscribe$)).subscribe((data: ServerResponce<User[]>) => {
            this.total = data.count;
            this.salaryTable = data.results;
        })
    }
    public changeColorPicker(controlName: string, event): void {
        this.validateForm.get(controlName).setValue(event)
    }
    onEditsalary(index: number) {
        this.isEditing = true;
        this.editIndex = index;
        this.getsalaryById(this.salaryTable[this.editIndex].id);
        this.showModal()
    }
    public getsalaryById(id: number) {
        this._driavesService.getUserById(id).pipe(takeUntil(this.unsubscribe$),
            switchMap((data: ServerResponce<User>) => {
                if (data.results && data.results[0]) {
                    let item = data.results[0]
                    this.validateForm.patchValue({
                        first_name: item.user.first_name,
                        last_name: item.user.last_name,
                        phone_number: item.phone_number,
                        username: item.user.username,
                        car_model: item.car_model,
                        car_color: item.car_color,
                        car_number: item.car_number,
                        car_capacity: item.car_capacity,
                    })
                }
                return this._combineObsevable()
            })).subscribe()

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
        let sendObject: SalaryRespone = Object.assign({}, this.validateForm.value, { image: '' })
        this.sendRequest(sendObject);

    }
    sendRequest(sendObject) {
        if (this.editIndex == null) {
            this._driavesService.addUser(sendObject).pipe(takeUntil(this.unsubscribe$)).subscribe((data: User) => {
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
            this._driavesService.editUser(this.salaryTable[this.editIndex].id, sendObject).pipe(takeUntil(this.unsubscribe$)).subscribe((data: SalaryRespone) => {
                this.getUsers()

                this.nzMessages.success(Messages.success)
                this.closeModal()
            },
                () => {
                    this.nzMessages.error(Messages.fail)
                })
        }
    }

    onDeletesalary(index: number): void {
        this._driavesService
            .deleteUserById(this.salaryTable[index].id)
            .pipe(
                takeUntil(this.unsubscribe$),
            )
            .subscribe(() => {

                this.salaryTable.splice(index, 1);

                this.salaryTable = [...this.salaryTable];
                if (!this.salaryTable.length && this.pageIndex !== 1) {
                    this.nzPageIndexChange(this.pageIndex - 1)
                }
                this.nzMessages.success(Messages.success)
            },
                () => {
                    this.nzMessages.error(Messages.fail)
                });
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