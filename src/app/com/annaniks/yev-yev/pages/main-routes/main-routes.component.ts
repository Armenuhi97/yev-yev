import { DatePipe } from "@angular/common";
import { Component } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd/message";
import { forkJoin, of, Subject, throwError } from "rxjs";
import { catchError, map, switchMap, takeUntil } from "rxjs/operators";
import { Messages } from "../../core/models/mesages";
import { OrderResponse } from "../../core/models/order";
import { OrderType } from "../../core/models/order-type";
import { OrdersByHours, SubrouteDetails } from "../../core/models/orders-by-hours";
import { RouteItem } from "../../core/models/routes.model";
import { User } from "../../core/models/salary";
import { ServerResponce } from "../../core/models/server-reponce";
import { AppService } from "../../core/services/app.service";
import { OrderTypeService } from "../../core/services/order-type";
import { MainRoutesService } from "./main-routes.service";

@Component({
    selector: 'app-main-routes',
    templateUrl: 'main-routes.component.html',
    styleUrls: ['main-routes.component.scss'],
    providers: [DatePipe]
})
export class MainRoutesComponent {
    selectIndex: number;
    isGetItem: boolean = false;
    userInfo: OrdersByHours[] = []
    currentDriver = []
    isVisibleOrderInfo: boolean = false;
    isOrderEditing: boolean = false;
    orderMembers = []
    editOrderIndex: number
    approvedOrders = []
    public subRouteInfos = [];
    selectedTime;
    public driver: User;
    isVisible: boolean = false;
    unsubscribe$ = new Subject();
    validateForm: FormGroup;
    phoneNumberPrefix = new FormControl('+374')
    userId: number;
    currentInterval;
    isShowError: boolean = false;
    isOpenInfo: boolean = false;
    radioValue: string = "approved";
    isEditing: boolean;
    editIndex;
    selectedDate = new Date();
    subRouteInfo: any;
    public mainRoutes: RouteItem[] = [];
    isOpenCalendar: boolean = false;
    countsList = [];
    currentId: number;
    drivers: User[];
    timeItem;
    windowHeight: number;
    selectInfo;
    private _param
    private _lastMainRouteId: number;
    orderTypes: OrderType[] = [];

    isGetFunction: boolean = true;
    isGet: boolean = true
    constructor(private _mainRoutesService: MainRoutesService, private _datePipe: DatePipe,
        private _fb: FormBuilder,
        private _activatedRoute: ActivatedRoute,
        private _mainRouteService: MainRoutesService,
        private _appService: AppService,
        private _router: Router,
        private nzMessages: NzMessageService,
        private _orderTypeService: OrderTypeService) {
        this.orderTypes = this._orderTypeService.getOrderTypes()

    }

    ngOnInit() {
        this.combine();
        this._initForm();
    }
    private _checkQueryParams() {
        return this._activatedRoute.queryParams.pipe(takeUntil(this.unsubscribe$), switchMap((param) => {

            if (this.isGet) {
                this.isGet = true
                if (param.date && (!this._param || (this._param && (this._param.date !== param.date || this._param.subRoute !== param.subRoute || this._param.mainRoute !== param.mainRoute)))) {
                    this._param = param
                    this.userInfo = [];
                    this.isOpenInfo = false;
                    let item = this.mainRoutes.filter((val) => { return val.id == +param.mainRoute });
                    if (item && item[0]) {
                        let index = this.mainRoutes.indexOf(item[0]);
                        this.selectIndex = index;
                    }
                    this.selectedDate = param.date
                    this.currentId = +param.mainRoute;
                    this.isGetFunction = false;
                    let time = this._datePipe.transform(param.date, 'HH:mm');

                    return this.combineObservable(param.subRoute, time).pipe(
                        map(() => {
                            this.isGet = false;
                            this._param = {}
                            this._router.navigate([], { queryParams: {} });

                        })
                    )


                } else {
                    if (!this._param || (this._param && +this._param.mainRoute !== +this.currentId) || (+this._lastMainRouteId !== +this.currentId)) {

                        this._lastMainRouteId = this.currentId;
                        return this.combineObservable()
                    } else {
                        return of()
                    }
                }
            } else {
                this.isGet = true
                return of()
            }
        }))

    }
    public send(data) {
        this._mainRouteService.sendMessage(data.id).pipe(takeUntil(this.unsubscribe$)).subscribe((result: { status_message: string }) => {
            if (result.status_message == 'ok') {
                this.nzMessages.success(Messages.success);
                data.viber_message_sended = true

            } else {
                this.nzMessages.error(Messages.fail);

            }
        })
    }
    public isCanceledByClient(data) {
        let canceledByClient: boolean = false;
        for (let item of data.approved_order_orders) {
            if (item.order.canceled_by_client) {
                canceledByClient = true;
                break
            }
        }
        return canceledByClient
    }
    getOrderType(type: number): string {
        return this._appService.checkPropertyValue(this._appService.checkPropertyValue(this.orderTypes.filter((val) => { return +val.id == +type }), 0), 'name_en')
    }
    private _initForm() {
        this.validateForm = this._fb.group({
            first_name: [null],
            last_name: [null],
            phone_number: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
            userComment: [null],
            startPointAddress: [null],
            endPointAddress: [null],
            order_phone_number: [null],
            orderType: [null, Validators.required],
            personCount: [null, Validators.required],
            comment: [null],
            date: [null],
            time: [null],
            isChangeStatus: [false]
        })

        this.validateForm.get('orderType').valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe((value) => {

            if (value == 2) {
                this.validateForm.get('personCount').setValue(0);
                this.validateForm.get('personCount').disable()
            } else {
                this.validateForm.get('personCount').enable();
                if (value == 1 && ((this.validateForm.get('personCount').value < 4 || this.validateForm.get('personCount').value > 8) || !this.validateForm.get('personCount').value)) {
                    this.validateForm.get('personCount').reset();
                }
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
    combine() {
        const combine = forkJoin(
            this.getAllRoutes(),
        )
        combine.pipe(takeUntil(this.unsubscribe$)).subscribe()
    }
    getAllRoutes() {
        return this._mainRoutesService.getAllRoutes(1).pipe(map((data: ServerResponce<RouteItem[]>) => {
            this.mainRoutes = data.results
        }))
    }

    getRouteInfo(id, subrouteId?, time?) {
        return this._mainRoutesService.getSubRoute(id).pipe(
            map((data: ServerResponce<any>) => {
                if (subrouteId && time) {
                    data.results = data.results.map((data) => {
                        let selectTime;
                        if (+data.id == +subrouteId) {
                            selectTime = time
                        }
                        return Object.assign(data, { selectTime: selectTime })
                    })
                }
                this.subRouteInfos = data.results;
                this.isGetItem = true
                // return this.getHourlyOrdersByDate(id)
            }))
    }
    getLabelOfDrivers(dr: User) {
        return `${dr.user.first_name} ${dr.user.last_name} (${dr.car_model}) (${dr.car_capacity})`
    }
    onChangeTab($event) {

        this.userInfo = [];
        this.isOpenInfo = false;
        this.selectIndex = $event
        this.currentId = this.mainRoutes[this.selectIndex].id;
        if (this.isGetFunction) {
            this._checkQueryParams().pipe(takeUntil(this.unsubscribe$)).subscribe()
        } else {
            this.isGetFunction = true
        }

    }
    combineObservable(subrouteId?: number, time?: string) {
        const combine = forkJoin(
            this.getRouteInfo(this.currentId, subrouteId, time),
            this.getDrivers()
        )
        return combine
    }
    getDrivers() {
        return this._mainRoutesService.getDrivers(this.currentId).pipe(
            map((data: ServerResponce<User[]>) => {
                this.drivers = data.results
            },
                catchError(() => {
                    this.drivers = []
                    return throwError(false)
                }))
        )
    }
    changeStatus($event) {
        this.getInfo(this.selectedTime, $event).subscribe()
    }
    public getApprovedOrders() {
        return this._mainRouteService.getAllAprovedOrders(this.subRouteInfo.id, this._formatDate(this.selectedTime)).pipe(
            map((orders: ServerResponce<any>) => {
                this.approvedOrders = orders.results
            })
        )
    }
    private _formatDate(time, selectDate = this.selectedDate) {

        let date = this._datePipe.transform(selectDate, 'yyyy-MM-dd');
        let currenTime = time.slice(0, time.indexOf(' '))
        let current = `${date} ${currenTime}`;
        return current
    }
    public showModal(): void {
        this.isVisible = true;
        if (this.subRouteInfo.start_point_is_static) {
            this.validateForm.get('startPointAddress').setValue(this.subRouteInfo.start_point_address_hy);
            this.validateForm.get('startPointAddress').disable()

        }
        if (this.subRouteInfo.end_point_is_static) {
            this.validateForm.get('endPointAddress').setValue(this.subRouteInfo.end_point_address_hy);
            this.validateForm.get('endPointAddress').disable()

        }
    }
    public checkAddress(moderator) {
        if (this.subRouteInfo.start_point_is_static) {
            return moderator.end_address ? moderator.end_address : 'Հասցե չկա'
        } else {
            if (this.subRouteInfo.end_point_is_static) {
                return moderator.start_address ? moderator.start_address : 'Հասցե չկա'
            } else {
                return (moderator.start_address || moderator.end_address) ? `${moderator.start_address} - ${moderator.end_address}` : 'Հասցե չկա'
            }
        }
    }

    public openOrderModal() {
        this.isVisibleOrderInfo = true;
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
        if (this.timeItem && !this.timeItem.isDisabled) {
            let item = this.orderMembers.filter((data) => { return (data.isSelect == true) })

            let orderIds = item.map((data) => {
                return { id: data.order.id }
            });
            // if (orderIds && orderIds.length) {
            let sendObject = {
                "sub_route": this.subRouteInfo.id,
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
            // }
        }
    }
    cancelCancelation(moderator) {
        this._mainRouteService.cancelCancelation(moderator.order.id).pipe(takeUntil(this.unsubscribe$),
            map(() => {
                // this.closeModal();
                this.nzMessages.success(Messages.success);
                moderator.order.canceled_by_client = false;
                // this.getInfo(this.selectedTime).subscribe();
            })).subscribe()
    }
    approveCancelation(id: number, index) {
        this._mainRouteService.approveCancelation(id).pipe(takeUntil(this.unsubscribe$),
            map(() => {
                // this.closeModal();
                this.orderMembers.splice(index, 1);
                this.nzMessages.success(Messages.success)

                this.getInfo(this.selectedTime).subscribe();

            })).subscribe()
    }
    nzPageIndexChange(page: number) { }

    public addOrderByDriver() {
        if (this.driver) {
            let orders = this.userInfo.filter((data) => { return (data.isSelect == true && data.is_in_approved_orders == false) })

            let ordersIds = orders.map((data) => { return { id: data.id } })

            let sendObject = {
                "sub_route": this.subRouteInfo.id,
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
                "sub_route": this.subRouteInfo.id,
                "date": date,
                "person_count": this.validateForm.get('personCount').value,
                "start_address": this.validateForm.get('startPointAddress').value,
                "start_langitude": '',
                "start_latitude": '',
                "end_address": this.validateForm.get('endPointAddress').value,
                "end_langitude": '',
                "end_latitude": '',
                "user": this.userId ? this.userId : null,
                "order_phone_number": this.validateForm.get('order_phone_number').value ? '+374' + this.validateForm.get('order_phone_number').value : null,
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
                "sub_route": this.subRouteInfo.id,
                "date": date,
                "person_count": this.validateForm.get('personCount').value,
                "start_address": this.validateForm.get('startPointAddress').value,
                "start_langitude": '',
                "start_latitude": '',
                "end_address": this.validateForm.get('endPointAddress').value,
                "end_langitude": '',
                "end_latitude": '',
                "user": this.userId ? this.userId : null,
                "order_phone_number": this.validateForm.get('order_phone_number').value ? '+374' + this.validateForm.get('order_phone_number').value : null,
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
    getInfo(time, status = this.radioValue) {
        if (time) {
            this.isOpenInfo = true;
            let current = this._formatDate(time);

            return this._mainRouteService.getOrdersByHour(this.subRouteInfo.id, current, status).pipe(takeUntil(this.unsubscribe$),
                switchMap((data: OrdersByHours[]) => {
                    this.userInfo = data;
                    this.userInfo = this.userInfo.map((val) => {
                        let isSelect = val.is_in_approved_orders ? true : false
                        return Object.assign({}, val, { is_in_approved_orders: val.is_in_approved_orders, isSelect: isSelect, isDisabled: false })
                    })
                    this.isGetItem = true;
                    return this.getApprovedOrders()
                }))
        } else {
            return of()
        }
    }
    resetItem($event) {
        this.isGetItem = $event
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
                "sub_route": this.subRouteInfo.id,
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
                    this.nzMessages.success(Messages.success)
                },
                    () => {
                        this.nzMessages.error(Messages.fail)
                    });
        }

    }
    get tableTitle() {
        if (this.subRouteInfo && this.subRouteInfo.start_point_city) {
            return `${this.subRouteInfo.start_point_city.name_hy} - ${this.subRouteInfo?.end_point_city.name_hy}`
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
        if (this.drivers)
            if (calculateCount) {
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
    public onEditOrder(index) {
        this.isEditing = true;
        this.editIndex = index;
        let info = this.userInfo[this.editIndex]
        this.validateForm.patchValue({
            startPointAddress: info.start_address,
            endPointAddress: info.end_address,
            order_phone_number: info.order_phone_number,
            orderType: info.order_type,
            personCount: info.person_count,
            comment: info.comment,
            date: this.selectedDate,
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

    getInformation($event, index) {
        if ($event) {
            this.timeItem = $event.timeItem
            this.selectedTime = $event.time;
            this.subRouteInfo = this.subRouteInfos[index]
            this.getInfo($event.time).subscribe()
        }
    }

    openCalendar($event) {
        this.isOpenCalendar = true;
        if ($event) {
            this.userInfo = [];
            this.isOpenInfo = false;
            this.isGetItem = true
            // this.getHourlyOrdersByDate(this.currentId).pipe(takeUntil(this.unsubscribe$)).subscribe()
        }
    }

    closeCalendar() {
        this.isOpenCalendar = false;
    }

    changeDate(type: number) {
        let date = new Date(this.selectedDate)
        date.setDate(date.getDate() + type);
        this.selectedDate = new Date(date);
        this.isGetItem = true;
        // this.getHourlyOrdersByDate(this.currentId).pipe(takeUntil(this.unsubscribe$)).subscribe()
    }
    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}