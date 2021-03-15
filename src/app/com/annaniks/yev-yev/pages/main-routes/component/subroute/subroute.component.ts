import { DatePipe } from "@angular/common";
import { Component, Input } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd/message";
import { forkJoin, Observable, of, Subject } from "rxjs";
import { map, switchMap, takeUntil } from "rxjs/operators";
import { isBuffer } from "util";
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
    currentDriver = []
    isVisibleOrderInfo: boolean = false;
    isOrderEditing: boolean = false;
    orderMembers = []
    editOrderIndex: number
    approvedOrders = []
    public subrouteInfo: SubrouteDetails;
    selectedTime;
    public driver;
    isVisible: boolean = false;
    unsubscribe$ = new Subject();
    validateForm: FormGroup;
    phoneNumberPrefix = new FormControl('+374')
    userId: number;
    isShowError: boolean = false;
    orderTypes: OrderType[] = [];
    radioValue: string = "approved";
    isEditing: boolean;
    editIndex;
    @Input('types')
    set setOrderTypes($event: OrderType[]) {
        this.orderTypes = $event;
    }
    @Input('info')
    set setInfo($event) {
        this.subrouteInfo = $event;
        //set open times
        if (this.subrouteInfo && this.subrouteInfo.countList)
            for (let item of this.subrouteInfo.countList.orders) {
                let date = this._datePipe.transform(new Date(item.hour), 'HH:mm');
                for (let time of this.openTimes) {
                    if (time.time.startsWith(date)) {
                        time = Object.assign(time, {
                            approved_seat_count: this._appService.checkPropertyValue(this._appService.checkPropertyValue(item, 'order'), 'approved_seat_count', 0),
                            pending_seat_count: this._appService.checkPropertyValue(this._appService.checkPropertyValue(item, 'order'), 'pending_seat_count', 0),
                            seat_count: this._appService.checkPropertyValue(this._appService.checkPropertyValue(item, 'order'), 'seat_count', 0)
                        })

                    }
                }
            }
    }


    drivers: User[] = []
    @Input('drivers')
    set setDrivers($event: User[]) {
        this.drivers = $event;
    }
    index: number;
    @Input('index')
    set setIndex($event) {
        this.index = +$event
    }
    private _date;
    @Input('date')
    set setDate($event) {
        this._date = $event;
        if (this.subrouteInfo && this._date) {
            this.getClosedHours(this.subrouteInfo.id).pipe(
                switchMap(() => {
                    if (this.isOpenInfo && this.selectedTime) {
                        return this.getInfo(this.selectedTime)
                    } else {
                        return of()
                    }
                })
            ).subscribe()
        }

    }
    isOpenInfo: boolean = false
    openTimes = [
        { time: '05:30 - 06:00', isActive: true, closeId: 0 },
        { time: '06:00 - 06:30', isActive: true, closeId: 0 },
        { time: '06:30 - 07:00', isActive: true, closeId: 0 },
        { time: '07:00 - 07:30', isActive: true, closeId: 0 },
        { time: '07:30 - 08:00', isActive: true, closeId: 0 },
        { time: '08:30 - 09:00', isActive: true, closeId: 0 },
        { time: '09:00 - 09:30', isActive: true, closeId: 0 },
        { time: '09:30 - 10:00', isActive: true, closeId: 0 },
        { time: '10:30 - 11:00', isActive: true, closeId: 0 },
        { time: '11:00 - 11:30', isActive: true, closeId: 0 },
        { time: '11:30 - 12:00', isActive: true, closeId: 0 },
        { time: '12:00 - 12:30', isActive: true, closeId: 0 },
        { time: '12:30 - 13:00', isActive: true, closeId: 0 },
        { time: '13:00 - 13:30', isActive: true, closeId: 0 },
        { time: '13:30 - 14:00', isActive: true, closeId: 0 },
        { time: '14:00 - 14:30', isActive: true, closeId: 0 },
        { time: '14:30 - 15:00', isActive: true, closeId: 0 },
        { time: '15:00 - 15:30', isActive: true, closeId: 0 },
        { time: '15:30 - 16:00', isActive: true, closeId: 0 },
        { time: '16:00 - 16:30', isActive: true, closeId: 0 },
        { time: '16:30 - 17:00', isActive: true, closeId: 0 },
        { time: '17:00 - 17:30', isActive: true, closeId: 0 },
        { time: '17:30 - 18:00', isActive: true, closeId: 0 },
        { time: '18:00 - 18:30', isActive: true, closeId: 0 },
        { time: '18:30 - 19:00', isActive: true, closeId: 0 },
        { time: '19:00 - 19:30', isActive: true, closeId: 0 },
        { time: '19:30 - 20:00', isActive: true, closeId: 0 },
        { time: '20:00 - 20:30', isActive: true, closeId: 0 },
        { time: '20:30 - 21:00', isActive: true, closeId: 0 }
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
    public onEditOrder(index) {
        this.isEditing = true;
        this.editIndex = index;
        let info = this.userInfo[this.editIndex]
        this.validateForm.patchValue({
            startPointAddress: info.start_address,
            endPointAddress: info.end_address,
            orderPhoneNumber: info.order_phone_number,
            orderType: info.order_type,
            personCount: info.person_count,
            comment: info.comment,
            date: this._date,
            time: this.selectedTime,
        })
        this.userId = info.user
        this.showModal()
    }
    selectCheckbox($event, index) {
        // 0
        // 1 nstatex
        // 2 avtomeqena      
        let type = this.userInfo[index].order_type_details.id;
        let id = this.userInfo[index].id;
        for (let item of this.userInfo) {
            if (type == 2) {
                if ((item.order_type_details.id == 1 || item.order_type_details.id == 2) && (+id !== +item.id)) {
                    // item.isSelect = false;
                    item.isDisabled = $event ? true : false

                }
            } else {
                if (type == 1) {
                    if ((item.order_type_details.id == 2) && item.id !== id) {
                        // item.isSelect = false;
                        item.isDisabled = $event ? true : false

                    }
                }
            }
        }
    }
    public onEditOrderMembers(index) {
        this.isOrderEditing = true;
        this.editOrderIndex = index;
        this.orderMembers = this.approvedOrders[this.editOrderIndex].approved_order_orders;

        this.orderMembers = this.orderMembers.map((val) => { return Object.assign({}, val, { isSelect: true }) });
        this.openOrderModal()

    }
    getHourlyOrdersByDate() {
        let date = this._datePipe.transform(this._date, 'yyyy-MM-dd');
        return this._mainRouteService.getHourlyOrdersByDate(this.subrouteInfo.main_route, date).pipe(
            map((data: any) => {
                if (data[this.index] && data[this.index].orders)

                    for (let item of data[this.index].orders) {
                        let date = this._datePipe.transform(new Date(item.hour), 'HH:mm');
                        for (let time of this.openTimes) {
                            if (time.time.startsWith(date)) {
                                time = Object.assign(time, {
                                    approved_seat_count: this._appService.checkPropertyValue(this._appService.checkPropertyValue(item, 'order'), 'approved_seat_count', 0),
                                    pending_seat_count: this._appService.checkPropertyValue(this._appService.checkPropertyValue(item, 'order'), 'pending_seat_count', 0),
                                    seat_count: this._appService.checkPropertyValue(this._appService.checkPropertyValue(item, 'order'), 'seat_count', 0)
                                })


                            }
                        }
                    }
                // this.subrouteInfo = this.subrouteInfo.countList = data[this.index]
            })
        )
    }


    public getClosedHours(id: number): Observable<any> {
        let date = this._datePipe.transform(this._date, 'yyyy-MM-dd');
        return this._mainRouteService.getCloseHours(id, date).pipe(takeUntil(this.unsubscribe$), map((data: ServerResponce<ClosedHours[]>) => {
            this.openTimes.map((val) => { return Object.assign(val, { isActive: true }) })
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
        }))
    }
    getLabelOfDrivers(dr: User) {
        return `${dr.user.first_name} ${dr.user.last_name} (${dr.car_model}) (${dr.car_capacity})`
    }
    changeUserStatus($event, data) {
        if (data.closeId && $event) {
            this._mainRouteService.openHours(data.closeId).pipe(takeUntil(this.unsubscribe$)).subscribe()
        } else {
            let current = this._formatDate(data.time)
            this._mainRouteService.closeHours(this.subrouteInfo.id, current).pipe(takeUntil(this.unsubscribe$)).subscribe()
        }
    }
    check(item) {
        return item ? +item : 0
    }
    private _initForm() {
        this.validateForm = this._fb.group({
            first_name: [null],
            last_name: [null],
            phone_number: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
            userComment: [null],
            startPointAddress: [null],
            endPointAddress: [null],
            orderPhoneNumber: [null],
            orderType: [null, Validators.required],
            personCount: [null, Validators.required],
            comment: [null],
            date: [null],
            time: [null],
            isChangeStatus: [false]
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
                            order_phone_number: value
                        })

                        return this._mainRouteService.getUserByPhonenumber('+374' + value).pipe(map(((data: ServerResponce<User[]>) => {
                            let result = data.results
                            if (result && result.length) {
                                this.isShowError = false
                                let item = result[0];
                                this.userId = item.id
                                this.validateForm.patchValue({
                                    first_name: item.user.first_name,
                                    last_name: item.user.last_name,
                                    userComment: item.comment
                                })
                                this.validateForm.get('first_name').disable()
                                this.validateForm.get('last_name').disable()
                            } else {
                                this.validateForm.get('first_name').reset()
                                this.validateForm.get('last_name').reset()
                                this.validateForm.get('first_name').enable()
                                this.validateForm.get('last_name').enable()
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
    getInfo(time, status = this.radioValue): Observable<any> {
        if (time) {
            this.selectedTime = time
            this.isOpenInfo = true;
            let current = this._formatDate(time)
            return this._mainRouteService.getOrdersByHour(this.subrouteInfo.id, current, status).pipe(takeUntil(this.unsubscribe$),
                switchMap((data: OrdersByHours[]) => {
                    this.userInfo = data;
                    this.userInfo = this.userInfo.map((val) => {
                        let isSelect = val.is_in_approved_orders ? true : false
                        return Object.assign({}, val, { is_in_approved_orders: val.is_in_approved_orders, isSelect: isSelect, isDisabled: false })
                    })
                    return forkJoin([this.getApprovedOrders(),
                    this.getHourlyOrdersByDate()])
                }))
        } else {
            return of()
        }
    }
    getInformation(time, status = this.radioValue) {
        this.getInfo(time, status).subscribe()
    }
    changeStatus($event) {
        this.getInfo(this.selectedTime, $event).subscribe()
    }
    public getApprovedOrders() {
        return this._mainRouteService.getAllAprovedOrders(this.subrouteInfo.id, this._formatDate(this.selectedTime)).pipe(
            map((orders: ServerResponce<any>) => {
                this.approvedOrders = orders.results
            })
        )
    }
    private _formatDate(time, selectDate = this._date) {
        let date = this._datePipe.transform(selectDate, 'yyyy-MM-dd');
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
    public checkAddress(moderator) {
        if (this.subrouteInfo.start_point_is_static) {
            return moderator.end_address ? moderator.end_address : 'Հասցե չկա'
        } else {
            if (this.subrouteInfo.end_point_is_static) {
                return moderator.start_address ? moderator.start_address : 'Հասցե չկա'
            } else {
                return (moderator.start_address || moderator.end_address) ? `${moderator.start_address} - ${moderator.end_address}` : 'Հասցե չկա'
            }
        }
    }

    public openOrderModal() {
        this.isVisibleOrderInfo = true
    }
    handleCancel(): void {
        this.isVisible = false;
        this.validateForm.reset();
        this.validateForm.enable();
        this.userId = null
        this.isShowError = false;
        this.isEditing = false;
        this.editIndex = null;
        this.isOrderEditing = false;
        this.editOrderIndex = null;
        this.isVisibleOrderInfo = false;
        this.orderMembers = []

    }
    onOrderSave() {

        let item = this.orderMembers.filter((data) => { return (data.isSelect == true) })

        let orderIds = item.map((data) => {
            return { id: data.order.id }
        });
        if (orderIds && orderIds.length) {
            let sendObject = {
                "sub_route": this.subrouteInfo.id,
                "date": this._formatDate(this.selectedTime),
                "driver": this.approvedOrders[this.editOrderIndex].driver,
                "order": orderIds
            }
            this._mainRouteService.editApprovedOrder(this.approvedOrders[this.editOrderIndex].id, sendObject).pipe(takeUntil(this.unsubscribe$),
                map(() => {
                    this.closeModal()
                    this.getInfo(this.selectedTime).subscribe();
                    this.nzMessages.success(Messages.success)

                })).subscribe()
        }

    }
    nzPageIndexChange(page: number) { }

    public addOrderByDriver() {
        if (this.driver) {
            let orders = this.userInfo.filter((data) => { return (data.isSelect == true && data.is_in_approved_orders == false) })

            let ordersIds = orders.map((data) => { return { id: data.id } })

            let sendObject = {
                "sub_route": this.subrouteInfo.id,
                "date": this._formatDate(this.selectedTime),
                "driver": this.driver,
                "order": ordersIds
            }
            this._mainRouteService.addApprovedOrder(sendObject).pipe(takeUntil(this.unsubscribe$),
                map(() => {
                    this.driver = null
                    this.getInfo(this.selectedTime).subscribe()
                    // return forkJoin([this.getApprovedOrders(),
                    //     this.getHourlyOrdersByDate()])
                })).subscribe()
        }
    }
    public onDeleteApprovedOrder(index) {
        this._mainRouteService.deleteApprovedOrder(this.approvedOrders[index].id).pipe(takeUntil((this.unsubscribe$)),
            map(() => {
                // return forkJoin([this.getApprovedOrders(),
                //     this.getHourlyOrdersByDate()])
                this.getInfo(this.selectedTime).subscribe()
            })).subscribe()
    }
    public onclientSave() {
        if (this.isEditing) {
            let date = this._formatDate(this.validateForm.get('time').value, this.validateForm.get('date').value)
            let editResponse = {
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
            this.sendEditRequest(this.userInfo[this.editIndex].id, editResponse);

        } else {
            if (this.validateForm.invalid) {
                this.nzMessages.error(Messages.fail);
                return;
            }
            let date = this._formatDate(this.selectedTime)

            let sendObject: OrderResponse = {
                "first_name": this._appService.checkPropertyValue(this.validateForm.get('first_name'), 'value', ""),
                "last_name": this._appService.checkPropertyValue(this.validateForm.get('last_name'), 'value', ""),
                "user_comment": this.validateForm.get('userComment').value,
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
                "status": this.radioValue
            }
            this.sendRequest(sendObject);
        }
    }
    sendRequest(sendObject) {
        this._mainRouteService.addOrder(sendObject).pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
            this.nzMessages.success(Messages.success);
            this.closeModal();
            this.getInfo(this.selectedTime).subscribe()
        },
            () => {
                this.nzMessages.error(Messages.fail)
            })

    }
    sendEditRequest(id, sendObject) {
        this._mainRouteService.changeOrder(id, sendObject).pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
            this.nzMessages.success(Messages.success)
            this.closeModal();
            if (this.radioValue == 'pending') {
                this._mainRouteService.changeOrderStatus(id).subscribe(() => {
                    this.getInfo(this.selectedTime).subscribe()
                })
            } else {
                this.getInfo(this.selectedTime).subscribe()
            }
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
        this.isShowError = false;
        this.isEditing = false;
        this.editIndex = null;
        this.isOrderEditing = false;
        this.editOrderIndex = null;
        this.isVisibleOrderInfo = false;
        this.orderMembers = []

    }
    addSelectedOrder(index) {
        let item = this.userInfo.filter((data) => { return (data.is_in_approved_orders == false && data.isSelect == true) });
        let orderIds = item.map((data) => {
            return { id: data.id }
        });
        let selectedOrders = this.approvedOrders[index].approved_order_orders.map((val) => {
            return { id: val.order.id }
        })
        let mergeArray = [...orderIds, ...selectedOrders];
        if (orderIds && orderIds.length) {
            let sendObject = {
                "sub_route": this.subrouteInfo.id,
                "date": this._formatDate(this.selectedTime),
                "driver": this.approvedOrders[index].driver,
                "order": mergeArray
            }
            this._mainRouteService.editApprovedOrder(this.approvedOrders[index].id, sendObject).pipe(takeUntil(this.unsubscribe$),
                map(() => {
                    this.getInfo(this.selectedTime).subscribe();
                    this.nzMessages.success(Messages.success)

                })).subscribe()
        }
    }
    onDeleteOrder(index: number): void {

        if (this.userInfo[index].id) {
            this._mainRouteService
                .deleteOrders(this.userInfo[index].id)
                .pipe(
                    takeUntil(this.unsubscribe$),
                )
                .subscribe(() => {
                    this.getInfo(this.selectedTime).subscribe()
                    // this.driverRouteTable.splice(index, 1);

                    // this.driverRouteTable = [...this.driverRouteTable];
                    // if (!this.driverRouteTable.length && this.pageIndex !== 1) {
                    //     this.nzPageIndexChange(this.pageIndex - 1)
                    // }
                    this.nzMessages.success(Messages.success)
                },
                    () => {
                        this.nzMessages.error(Messages.fail)
                    });
        }

    }
    get tableTitle() {
        if (this.subrouteInfo && this.subrouteInfo.start_point_city) {
            return `${this.subrouteInfo.start_point_city.name_hy} - ${this.subrouteInfo?.end_point_city.name_hy}`
        } else {
            return
        }
    }
    get userCounts() {

        let item = this.userInfo.filter((data) => { return (data.is_in_approved_orders == false && data.isSelect == true) })
        let calculateCount = 0;
        item.forEach((data) => {
            calculateCount += data.person_count
        })
        if (calculateCount) {
            console.log(this.drivers);

            this.currentDriver = this.drivers.filter((val) => {
                return (+val.car_capacity >= calculateCount && val.user.is_active == true)
            })
        } else {
            this.currentDriver = this.drivers.filter((val) => {
                return (val.user.is_active == true)
            })
        }        
        return calculateCount
    }
    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}