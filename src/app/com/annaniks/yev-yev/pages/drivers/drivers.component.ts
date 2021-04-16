import { Component } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd/message";
import { forkJoin, Subject } from "rxjs";
import { map, switchMap, takeUntil } from "rxjs/operators";
import { CityItem } from "../../core/models/city.model";
import { Messages } from "../../core/models/mesages";
import { RouteItem } from "../../core/models/routes.model";
import { SalaryRespone, User } from "../../core/models/salary";
import { ServerResponce } from "../../core/models/server-reponce";
import { ViberInfo } from "../../core/models/viber";
import { AppService } from "../../core/services/app.service";
import { MainService } from "../main/main.service";
import { DriverService } from "./drivers.service";
@Component({
    selector: 'app-drivers',
    templateUrl: 'drivers.component.html',
    styleUrls: ['drivers.component.scss']
})
export class DriversComponent {
    locatedCityControl = new FormControl('', Validators.required)
    public isVisibleCityModal: boolean = false
    public activeTab: number = 0;
    cities: CityItem[] = []
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
    mainRouteFiler: number;
    viberInfo: ViberInfo[] = []
    constructor(private _driverService: DriverService,
        private nzMessages: NzMessageService,
        private _mainService: MainService,
        private _appService: AppService,
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
            car_color_name_hy: [null, Validators.required],
            car_color_name_en: [null, Validators.required],
            car_color_name_ru: [null, Validators.required],
            viber_id: [null],
            main_city_id: [null, Validators.required],
            located_city_id: [null]
        })
    }
    handleCancelCity() {
        this.isVisibleCityModal = false;
        this.locatedCityControl.reset();
        this.editIndex = null;
        this.editId = null
    }

    public changeFilter($event) {
        this.pageIndex = 1;
        this.getUsers($event).pipe(takeUntil(this.unsubscribe$)).subscribe()
    }
    public getAllRoutes() {
        return this._driverService.getAllRoutes().pipe(map((data: ServerResponce<RouteItem[]>) => {
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
    public onChangeTab($event) {
        this.activeTab = $event;
    }
    private _combineObsevable() {
        const combine = forkJoin(
            this.getAllRoutes(),
            this.getUsers(),
            this.getDriversViberInfo(),
            this.getCitites()
        )
        return combine.pipe(takeUntil(this.unsubscribe$))
    }
    getCitites() {
        return this._driverService.getAllCities().pipe(
            map((data: ServerResponce<CityItem[]>) => {
                this.cities = data.results;

            }))
    }
    getDriversViberInfo() {
        return this._driverService.getDriverViberInfo().pipe(
            map((data: ViberInfo[]) => {
                this.viberInfo = data;
            }))
    }
    public getUsers(mainRouteFiler?) {
        return this._driverService.getUsers(this.pageIndex, (this.pageIndex - 1) * 10, mainRouteFiler).pipe(
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
        this._driverService.getUserById(id).pipe(takeUntil(this.unsubscribe$),
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
                        car_color_name_hy: this.item.car_color_name_hy,
                        car_color_name_en: this.item.car_color_name_en,
                        car_color_name_ru: this.item.car_color_name_ru,
                        viber_id: this.item.viber_id,
                        main_city_id: this._appService.checkPropertyValue(this.item.main_city, 'id'),
                        located_city_id: this._appService.checkPropertyValue(this.item.located_city, 'id')
                    })
                }
            })).subscribe()

    }
    changeRouteCity(driver: User, index: number) {
        this.isVisibleCityModal = true;
        this.locatedCityControl.setValue(this._appService.checkPropertyValue(driver.located_city, 'id'));
        this.editIndex = index;
        this.editId = driver.id
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
        this.activeTab = 0;
        this.editId = 0;
        this.isVisibleCityModal=false;
        this.locatedCityControl.reset()
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
    onSaveCity() {
        if (this.locatedCityControl.valid) {
            let object = { located_city_id: this.locatedCityControl.value }
            this.sendRequest(object)
        }
    }
    sendRequest(sendObject) {
        if (!sendObject.located_city_id && sendObject.main_city_id) {
            sendObject.located_city_id = sendObject.main_city_id
        }
        if (this.editIndex == null) {

            this._driverService.addUser(sendObject).pipe(takeUntil(this.unsubscribe$),
                map((data: { driver_id: number }) => {
                    let routeRequests = []
                    this.addedRoutes.forEach((item) => {
                        item['user'] = data.driver_id;
                        routeRequests.push(this._driverService.addMainRouteToDriver(item))

                    })
                    forkJoin(routeRequests).subscribe();

                })).subscribe(() => {
                    this.handleCancel();
                    this.pageIndex = 1
                    this.getUsers().pipe(takeUntil(this.unsubscribe$)).subscribe();
                    this.nzMessages.success(Messages.success)
                },
                    (error) => {
                        this.nzMessages.error(Messages.fail)
                    })
        } else {
            this._driverService.editUser(this.salaryTable[this.editIndex].id, sendObject).pipe(takeUntil(this.unsubscribe$)).subscribe((data: SalaryRespone) => {
                this.getUsers().pipe(takeUntil(this.unsubscribe$)).subscribe()

                this.nzMessages.success(Messages.success)
                this.handleCancel()
            },
                (error) => {
                    let failMessage = Messages.fail
                    if (error && error.error && error.error[0] == 'Viber already in use.') {
                        failMessage = Messages.viberError
                    }
                    this.nzMessages.error(failMessage)
                })
        }
    }
    public changeUserStatus($event, id: number) {
        this._driverService.editUser(id, { is_active: $event }).pipe(takeUntil(this.unsubscribe$)).subscribe()
    }
    public removeRoute($event) {
        this.addedRoutes.splice($event, 1)
    }

    

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}