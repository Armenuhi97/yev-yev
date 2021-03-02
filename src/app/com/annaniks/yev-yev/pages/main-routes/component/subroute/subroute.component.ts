import { DatePipe } from "@angular/common";
import { Component, Input } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd/message";
import { of, Subject } from "rxjs";
import { map, switchMap, takeUntil } from "rxjs/operators";
import { ClosedHours } from "../../../../core/models/closed-hours";
import { Messages } from "../../../../core/models/mesages";
import { OrderResponse } from "../../../../core/models/order";
import { OrderType } from "../../../../core/models/order-type";
import { OrdersByHours, SubrouteDetails } from "../../../../core/models/orders-by-hours";
import { User } from "../../../../core/models/salary";
import { ServerResponce } from "../../../../core/models/server-reponce";
import { AppService } from "../../../../core/services/app.service";
import { MainRoutesService } from "../../main-routes.service";

@Component({
    selector: 'app-subroute',
    templateUrl: 'subroute.component.html',
    styleUrls: ['subroute.component.scss'],
    providers: [DatePipe]
})
export class SubrouteComponent {
    public subrouteInfo: SubrouteDetails;
    selectedTime;
    isVisible: boolean = false;
    unsubscribe$ = new Subject();
    validateForm: FormGroup;
    phoneNumberPrefix = new FormControl('+374')
    userId: number;
    isShowError: boolean = false;
    @Input('info')
    set setInfo($event) {
        this.subrouteInfo = $event;

        if (this.subrouteInfo && this.subrouteInfo.countList)
            for (let item of this.subrouteInfo.countList.orders) {
                let date = this._datePipe.transform(new Date(item.hour), 'HH:mm');
                for (let time of this.openTimes) {
                    if (time.time.startsWith(date)) {
                        time.count = item.order.seat_count;
                        time.requiredCount = item.order.order_count
                    }
                }
            }

        if (this.subrouteInfo) {
            this.getClosedHours(this.subrouteInfo.id);

        }
    }
    private _date;
    @Input('date')
    set setDate($event) {
        this._date = $event;
        if (this.isOpenInfo && this.selectedTime) {
            this.getInfo(this.selectedTime)
        }

    }
    orderTypes: OrderType[] = []
    @Input('orderTypes')
    set setOrderTypes($event: OrderType[]) {
        this.orderTypes = $event
    }
    drivers: User[] = []
    @Input('orderTypes')
    set setDrivers($event: User[]) {
        this.drivers = $event
        console.log(this.drivers);

    }
    isOpenInfo: boolean = false
    openTimes = [
        { time: '05:30 - 06:00', isActive: true, count: 0, requiredCount: 0, closeId: 0 },
        { time: '06:30 - 07:00', isActive: true, count: 0, requiredCount: 0, closeId: 0 },
        { time: '07:30 - 08:00', isActive: true, count: 0, requiredCount: 0, closeId: 0 },
        { time: '08:30 - 09:00', isActive: true, count: 0, requiredCount: 0, closeId: 0 },
        { time: '09:30 - 10:00', isActive: true, count: 0, requiredCount: 0, closeId: 0 },
        { time: '10:30 - 11:00', isActive: true, count: 0, requiredCount: 0, closeId: 0 },
        { time: '11:30 - 12:00', isActive: true, count: 0, requiredCount: 0, closeId: 0 },
        { time: '12:30 - 13:00', isActive: true, count: 0, requiredCount: 0, closeId: 0 },
        { time: '13:30 - 14:00', isActive: true, count: 0, requiredCount: 0, closeId: 0 },
        { time: '14:30 - 15:00', isActive: true, count: 0, requiredCount: 0, closeId: 0 },
        { time: '15:30 - 16:00', isActive: true, count: 0, requiredCount: 0, closeId: 0 },
        { time: '16:30 - 17:00', isActive: true, count: 0, requiredCount: 0, closeId: 0 },
        { time: '17:30 - 18:00', isActive: true, count: 0, requiredCount: 0, closeId: 0 },
        { time: '18:30 - 19:00', isActive: true, count: 0, requiredCount: 0, closeId: 0 },
        { time: '19:30 - 20:00', isActive: true, count: 0, requiredCount: 0, closeId: 0 },
        { time: '20:30 - 21:00', isActive: true, count: 0, requiredCount: 0, closeId: 0 }
    ]
    userInfo: OrdersByHours[] = []
    constructor(private _fb: FormBuilder,
        private _datePipe: DatePipe,
        private _mainRouteService: MainRoutesService,
        private _appService: AppService,
        private nzMessages: NzMessageService,) { }

    ngOnInit() {
        this._initForm()
    }
    public getClosedHours(id: number) {
        this._mainRouteService.getCloseHours(id).pipe(takeUntil(this.unsubscribe$)).subscribe((data: ServerResponce<ClosedHours[]>) => {
            let items = data.results
            for (let item of items) {
                let date = this._datePipe.transform(new Date(item.time), 'HH:mm');
                for (let time of this.openTimes) {
                    if (time.time.startsWith(date)) {
                        time.isActive = false;
                        time.closeId = item.id
                    }
                }
            }
        })
    }
    changeUserStatus($event, data) {
        if (data.closeId && $event) {
            this._mainRouteService.openHours(data.closeId).pipe(takeUntil(this.unsubscribe$)).subscribe()
        } else {
            let current = this._formatDate(data.time)
            this._mainRouteService.closeHours(this.subrouteInfo.id, current).pipe(takeUntil(this.unsubscribe$)).subscribe()
        }
    }
    private _initForm() {
        this.validateForm = this._fb.group({
            first_name: [null],
            last_name: [null],
            phone_number: [null, [Validators.required]],
            startPointAddress: [null],
            endPointAddress: [null],
            orderPhoneNumber: [null],
            orderType: [null, Validators.required],
            personCount: [null, Validators.required],
            comment: [null],
        })

        this.validateForm.get('orderType').valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe((value) => {
            if (value == 3) {
                this.validateForm.get('personCount').setValue(0);
                this.validateForm.get('personCount').disable()
            } else {
                this.validateForm.get('personCount').enable()

            }
        })
        this.validateForm.get('phone_number').valueChanges.pipe(takeUntil(this.unsubscribe$),
            switchMap((value) => {
                if (value) {
                    if (value.toString().length == 8) {
                        this.validateForm.patchValue({
                            orderPhoneNumber: value
                        })
                        return this._mainRouteService.getUserByPhonenumber('+374' + value).pipe(map(((data: ServerResponce<User[]>) => {
                            console.log(data);
                            let result = data.results
                            if (result && result.length) {
                                this.isShowError = false
                                let item = result[0];
                                this.userId = item.id
                                this.validateForm.patchValue({
                                    first_name: item.user.first_name,
                                    last_name: item.user.last_name,
                                })
                            } else {
                                this.isShowError = true
                            }
                        })))
                    } else {
                        return of(false)
                    }
                } else {
                    return of()
                }
            })).subscribe()
    }
    getInfo(time) {
        this.selectedTime = time
        this.isOpenInfo = true;
        let current = this._formatDate(time)
        this._mainRouteService.getOrdersByHour(this.subrouteInfo.id, current).pipe(takeUntil(this.unsubscribe$)).subscribe((data: OrdersByHours[]) => {
            this.userInfo = data;
            this.userInfo = this.userInfo.map((val) => { return Object.assign({}, val, { isSelect: false }) })
        })
    }
    private _formatDate(time) {
        let date = this._datePipe.transform(this._date, 'yyyy-MM-dd');
        let currenTime = time.slice(0, time.indexOf(' '))
        let current = `${date} ${currenTime}`;
        return current
    }
    public showModal(): void {
        this.isVisible = true;
        if (this.subrouteInfo.start_point_is_static) {
            this.validateForm.get('startPointAddress').setValue(this.subrouteInfo.start_point_address_hy);
            this.validateForm.get('startPointAddress').disable()

        }
        if (this.subrouteInfo.end_point_is_static) {
            this.validateForm.get('endPointAddress').setValue(this.subrouteInfo.end_point_address_hy);
            this.validateForm.get('endPointAddress').disable()

        }
    }
    handleCancel(): void {
        this.isVisible = false;
        this.validateForm.reset();
        this.validateForm.enable();
        this.userId = null
        this.isShowError = false

    }
    nzPageIndexChange(page: number) {
        // this.pageIndex = page;
        // this.getUsers()
    }
    public onclientSave() {
        if (this.validateForm.invalid) {
            this.nzMessages.error(Messages.fail);
            return;
        }
        let date = this._formatDate(this.selectedTime)

        let sendObject: OrderResponse = {
            "first_name": this._appService.checkPropertyValue(this.validateForm.get('first_name'), 'value', ""),
            "last_name": this._appService.checkPropertyValue(this.validateForm.get('last_name'), 'value', ""),
            "phone_number": '+374' + this.validateForm.get('phone_number').value,
            "comment": this.validateForm.get('comment').value,
            "sub_route": this.subrouteInfo.id,
            "date": date,
            "person_count": this.validateForm.get('personCount').value,
            "start_address": this.validateForm.get('startPointAddress').value,
            "start_langitude": '',
            "start_latitude": '',
            "end_address": this.validateForm.get('endPointAddress').value,
            "end_langitude": '',
            "end_latitude": '',
            "user": this.userId ? this.userId : null,
            "order_phone_number": this.validateForm.get('orderPhoneNumber').value ? '+374' + this.validateForm.get('orderPhoneNumber').value : null,
            "order_type": this.validateForm.get('orderType').value,
        }
        this.sendRequest(sendObject);
    }
    sendRequest(sendObject) {
        this._mainRouteService.addOrder(sendObject).pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
            this.nzMessages.success(Messages.success)
            this.closeModal();
            this.getInfo(this.selectedTime)
        },
            () => {
                this.nzMessages.error(Messages.fail)
            })

    }
    closeModal(): void {
        this.isVisible = false;
        this.validateForm.reset();
        this.validateForm.enable();
        this.userId = null;
        this.isShowError = false

    }

    get tableTitle() {
        if (this.subrouteInfo && this.subrouteInfo.start_point_city) {
            return `${this.subrouteInfo.start_point_city.name_hy}  ${this.subrouteInfo?.end_point_city.name_hy}`
        } else {
            return
        }
    }
    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}