import { Component } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd/message";
import { forkJoin, Subject } from "rxjs";
import { map, switchMap, takeUntil } from "rxjs/operators";
import { Messages } from "../../core/models/mesages";
import { RouteItem } from "../../core/models/routes.model";
import { SalaryRespone, User } from "../../core/models/salary";
import { ServerResponce } from "../../core/models/server-reponce";
import { ViberInfo } from "../../core/models/viber";
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
    editId: number
    routes: RouteItem[] = [];
    item: User;
    addedRoutes = [];
    viberInfo:ViberInfo[]=[]
    constructor(private _driavesService: DriverService,
        private nzMessages: NzMessageService,
        private _mainService: MainService,
        private _fb: FormBuilder) {
    }

    ngOnInit() {
        this._initForm();
        // this.getUsers()
        this._combineObsevable().subscribe()
    }
    private _initForm() {
        this.validateForm = this._fb.group({
            first_name: [null, Validators.required],
            last_name: [null, Validators.required],
            phone_number: [null, Validators.required],
            car_model: [null, Validators.required],
            car_color: [null, Validators.required],
            car_number: [null, Validators.required],
            car_capacity: [null, Validators.required],
            car_color_name:[null,Validators.required],
            viber_id:[null,Validators.required]
        })
    }

    public getAllRoutes() {
        return this._driavesService.getAllRoutes().pipe(map((data: ServerResponce<RouteItem[]>) => {
            this.total = data.count;
            this.routes = data.results;
            return data
        }))
    }
    public addRoute($event) {
        if ($event) {
            this.addedRoutes.push({ "main_route": $event })
        }
    }

    private _combineObsevable() {
        const combine = forkJoin(
            this.getAllRoutes(),
            this.getUsers(),
            this.getDriversViberInfo()
        )
        return combine.pipe(takeUntil(this.unsubscribe$))
    }
    getDriversViberInfo(){
        return this._driavesService.getDriverViberInfo().pipe(
            map((data:ViberInfo[]) => {                
                this.viberInfo = data;
            }))
    }
    public getUsers() {
        return this._driavesService.getUsers(this.pageIndex,(this.pageIndex-1)*10).pipe(
            map((data: ServerResponce<User[]>) => {
                this.total = data.count;
                this.salaryTable = data.results;
            }))
    }
    public changeColorPicker(controlName: string, event): void {
        this.validateForm.get(controlName).setValue(event)
    }
    onEditsalary(index: number) {
        this.isEditing = true;
        this.editIndex = index;
        this.editId = this.salaryTable[this.editIndex].id
        this.getsalaryById(this.salaryTable[this.editIndex].id);
        this.showModal()
    }
    public getsalaryById(id: number) {
        this._driavesService.getUserById(id).pipe(takeUntil(this.unsubscribe$),
            map((data: ServerResponce<User>) => {
                if (data.results && data.results[0]) {
                    this.item = data.results[0]
                    this.validateForm.patchValue({
                        first_name: this.item.user.first_name,
                        last_name: this.item.user.last_name,
                        phone_number: this.item.phone_number,
                        car_model: this.item.car_model,
                        car_color: this.item.car_color,
                        car_number: this.item.car_number,
                        car_capacity: this.item.car_capacity,
                        car_color_name:this.item.car_color_name,
                        viber_id:this.item.viber_id
                    })
                }
            })).subscribe()

    }
    public showModal(): void {
        this.isVisible = true;
    }
    handleCancel(): void {
        this.isVisible = false;
        this.isEditing = false;
        this.validateForm.reset();
        this.item = null
        this.addedRoutes = []
        this.editIndex = null
        this.editId = 0
    }
    nzPageIndexChange(page: number) {
        this.pageIndex = page;
        this.getUsers().pipe(takeUntil(this.unsubscribe$)).subscribe()
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
            this._driavesService.addUser(sendObject).pipe(takeUntil(this.unsubscribe$),
                map((data: { driver_id: number }) => {
                    let routeRequests = []
                    this.addedRoutes.forEach((item) => {
                        item['user'] = data.driver_id;
                        routeRequests.push(this._driavesService.addMainRouteToDriver(item))

                    })
                    forkJoin(routeRequests).subscribe();

                })).subscribe(() => {
                    this.closeModal();
                    this.pageIndex = 1
                    this.getUsers().pipe(takeUntil(this.unsubscribe$)).subscribe();
                    this.nzMessages.success(Messages.success)
                },
                    () => {
                        this.nzMessages.error(Messages.fail)
                    })
        } else {            
            this._driavesService.editUser(this.salaryTable[this.editIndex].id, sendObject).pipe(takeUntil(this.unsubscribe$)).subscribe((data: SalaryRespone) => {
                this.getUsers().pipe(takeUntil(this.unsubscribe$)).subscribe()

                this.nzMessages.success(Messages.success)
                this.closeModal()
            },
                () => {
                    this.nzMessages.error(Messages.fail)
                })
        }
    }
    public changeUserStatus($event, id: number) {
        this._driavesService.editUser(id, { is_active: $event }).pipe(takeUntil(this.unsubscribe$)).subscribe()
    }
    public removeRoute($event) {
        this.addedRoutes.splice($event, 1)
    }

    closeModal(): void {
        this.isVisible = false;
        this.validateForm.reset();
        this.addedRoutes = []
        this.item = null
        this.editIndex = null
        this.editId = 0
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}