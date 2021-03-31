import { DatePipe } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd/message";
import { Observable, of, Subject } from "rxjs";
import { map, switchMap, takeUntil } from "rxjs/operators";
import { ClosedHours } from "../../../../core/models/closed-hours";
import { OrderType } from "../../../../core/models/order-type";
import { OrdersByHours, SubrouteDetails } from "../../../../core/models/orders-by-hours";
import { ServerResponce } from "../../../../core/models/server-reponce";
import { AppService } from "../../../../core/services/app.service";
import { MainRoutesService } from "../../main-routes.service";
import * as moment from 'moment-timezone';

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
    currentInterval;
    lastDate;
    isShowError: boolean = false;
    orderTypes: OrderType[] = [
        {
            id: 0,
            name_en: 'Նստատեղ'
        },
        {
            id: 1,
            name_en: 'Ավտոմեքենա'
        },
        {
            id: 2,
            name_en: 'Ուղեբեռ'
        }
    ];
    radioValue: string = "approved";
    isEditing: boolean;
    editIndex;
    @Output('getInfo') private _info = new EventEmitter();
    @Output('resetItem') private _reset = new EventEmitter()
    index: number;
    @Input('index')
    set setIndex($event) {
        this.index = +$event
    }
    @Input('info')
    set setInfo($event) {
        this.subrouteInfo = $event;
        //set open times

        if (this.subrouteInfo && this.subrouteInfo.countList) {

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
        if (this.subrouteInfo && this.subrouteInfo.selectTime) {

            let time = this.openTimes.filter((data) => {                
                return (this.subrouteInfo.selectTime >= data.start && this.subrouteInfo.selectTime < data.end)
            });
            if (time && time[0]) {
                this.selectedTime = time[0];
                setTimeout(() => {
                    let element = document.getElementById(this.setId(time[0].start, this.index));
                    element.scrollIntoView();
                }, 500);

                this.getInformation(time[0])
            }
        }
    }



    isGetOrderCounts: boolean;
    @Input('isGetItem')
    set isGetItem($event) {
        this.isGetOrderCounts = $event;
        if ($event && this.selectedTime) {
            this.getHourlyOrdersByDate().pipe(takeUntil(this.unsubscribe$)).subscribe()
        }
    }
    private _date;
    @Input('date')
    set setDate($event) {
        this._date = $event;
        if (this._date) {
            this.currentInterval = null;
            if (!this.subrouteInfo.selectTime)
                this.selectedTime = null;
        }
        if (this.subrouteInfo && this._date) {
            this.getClosedHours(this.subrouteInfo.id).pipe(
                switchMap(() => {
                    //     if (this.isOpenInfo && this.selectedTime) {
                    //         return this.getInfo(this.selectedTime)
                    //     } else {
                    //         return of()
                    //     }
                    return this.getHourlyOrdersByDate()
                })

            ).subscribe()
        }



    }
    openTimes = [
        { start: '05:30', end: '06:00', time: '05:30 - 06:00', isActive: true, closeId: 0, isDisabled: false },
        { start: '06:00', end: '06:30', time: '06:00 - 06:30', isActive: true, closeId: 0, isDisabled: false },
        { start: '06:30', end: '07:00', time: '06:30 - 07:00', isActive: true, closeId: 0, isDisabled: false },
        { start: '07:00', end: '07:30', time: '07:00 - 07:30', isActive: true, closeId: 0, isDisabled: false },
        { start: '07:30', end: '08:00', time: '07:30 - 08:00', isActive: true, closeId: 0, isDisabled: false },
        { start: '08:30', end: '09:00', time: '08:30 - 09:00', isActive: true, closeId: 0, isDisabled: false },
        { start: '09:00', end: '09:30', time: '09:00 - 09:30', isActive: true, closeId: 0, isDisabled: false },
        { start: '09:30', end: '10:00', time: '09:30 - 10:00', isActive: true, closeId: 0, isDisabled: false },
        { start: '10:00', end: '10:30', time: '10:00 - 10:30', isActive: true, closeId: 0, isDisabled: false },
        { start: '10:30', end: '11:00', time: '10:30 - 11:00', isActive: true, closeId: 0, isDisabled: false },
        { start: '11:00', end: '11:30', time: '11:00 - 11:30', isActive: true, closeId: 0, isDisabled: false },
        { start: '11:30', end: '12:00', time: '11:30 - 12:00', isActive: true, closeId: 0, isDisabled: false },
        { start: '12:00', end: '12:30', time: '12:00 - 12:30', isActive: true, closeId: 0, isDisabled: false },
        { start: '12:30', end: '13:00', time: '12:30 - 13:00', isActive: true, closeId: 0, isDisabled: false },
        { start: '13:00', end: '13:30', time: '13:00 - 13:30', isActive: true, closeId: 0, isDisabled: false },
        { start: '13:30', end: '14:00', time: '13:30 - 14:00', isActive: true, closeId: 0, isDisabled: false },
        { start: '14:00', end: '14:30', time: '14:00 - 14:30', isActive: true, closeId: 0, isDisabled: false },
        { start: '14:30', end: '15:00', time: '14:30 - 15:00', isActive: true, closeId: 0, isDisabled: false },
        { start: '15:00', end: '15:30', time: '15:00 - 15:30', isActive: true, closeId: 0, isDisabled: false },
        { start: '15:30', end: '16:00', time: '15:30 - 16:00', isActive: true, closeId: 0, isDisabled: false },
        { start: '16:00', end: '16:30', time: '16:00 - 16:30', isActive: true, closeId: 0, isDisabled: false },
        { start: '16:30', end: '17:00', time: '16:30 - 17:00', isActive: true, closeId: 0, isDisabled: false },
        { start: '17:00', end: '17:30', time: '17:00 - 17:30', isActive: true, closeId: 0, isDisabled: false },
        { start: '17:30', end: '18:00', time: '17:30 - 18:00', isActive: true, closeId: 0, isDisabled: false },
        { start: '18:00', end: '18:30', time: '18:00 - 18:30', isActive: true, closeId: 0, isDisabled: false },
        { start: '18:30', end: '19:00', time: '18:30 - 19:00', isActive: true, closeId: 0, isDisabled: false },
        { start: '19:00', end: '19:30', time: '19:00 - 19:30', isActive: true, closeId: 0, isDisabled: false },
        { start: '19:30', end: '20:00', time: '19:30 - 20:00', isActive: true, closeId: 0, isDisabled: false },
        { start: '20:00', end: '20:30', time: '20:00 - 20:30', isActive: true, closeId: 0, isDisabled: false },
        { start: '20:30', end: '21:00', time: '20:30 - 21:00', isActive: true, closeId: 0, isDisabled: false }
    ]
    windowHeight: number;
    userInfo: OrdersByHours[] = []
    constructor(
        private _datePipe: DatePipe,
        private _mainRouteService: MainRoutesService,
        private _appService: AppService,
        private nzMessages: NzMessageService,) {
        this.windowHeight = (window.innerHeight - 470) / 2;
    }

    ngOnInit() {

    }

    getHourlyOrdersByDate() {
        let date = this._datePipe.transform(this._date, 'yyyy-MM-dd');
        return this._mainRouteService.getHourlyOrdersByDate(this.subrouteInfo.main_route, date).pipe(
            map((data: any) => {
                this.openTimes = this.openTimes.map((el) => { return Object.assign(el, { approved_seat_count: 0, pending_seat_count: 0, seat_count: 0 }) })
                if (data[this.index] && data[this.index].orders)
                    for (let item of data[this.index].orders) {
                        let dateFormat = moment(item.hour).format('HH:mm')
                        let date = moment(dateFormat, "HH:mm");
                        // let date = this._datePipe.transform(new Date(item.hour), 'HH:mm');
                        for (let time of this.openTimes) {
                            let start = moment(time.start, "HH:mm");
                            let end = moment(time.end, "HH:mm");
                            if ((moment(date).isSameOrAfter(start) && moment(date).isBefore(end))) {
                                time = Object.assign(time, {
                                    approved_seat_count: this._appService.checkPropertyValue(this._appService.checkPropertyValue(item, 'order'), 'approved_seat_count', 0),
                                    pending_seat_count: this._appService.checkPropertyValue(this._appService.checkPropertyValue(item, 'order'), 'pending_seat_count', 0),
                                    seat_count: this._appService.checkPropertyValue(this._appService.checkPropertyValue(item, 'order'), 'seat_count', 0)
                                })


                            }
                        }
                    }
                this._reset.emit(false)
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
                    this.checkCloseTimes(time)
                }
            }
            if (!items.length) {
                for (let time of this.openTimes) {
                    this.checkCloseTimes(time)
                }
            }

        }))
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

    getInformation(time) {
        this.selectedTime = time.time;

        this._info.emit({ timeItem: time, time: time.time })
        // this.getInfo(time, status).subscribe()
    }

    private _formatDate(time, selectDate = this._date) {
        let date = this._datePipe.transform(selectDate, 'yyyy-MM-dd');
        let currenTime = time.slice(0, time.indexOf(' '))
        let current = `${date} ${currenTime}`;
        return current
    }

    get tableTitle() {
        if (this.subrouteInfo && this.subrouteInfo.start_point_city) {
            return `${this.subrouteInfo.start_point_city.name_hy} - ${this.subrouteInfo?.end_point_city.name_hy}`
        } else {
            return
        }
    }


    checkCloseTimes(data) {
        var timezone = 'Asia/Yerevan';
        let currentTime = moment().tz(timezone).format('HH:mm')
        let currentDateFormat = moment().tz(timezone).format('DD.MM.yyyy');
        let currentDate = moment(currentDateFormat, "DD.MM.yyyy")
        let item = moment(this._date).format("DD.MM.yyyy")
        let selectedDate = moment(item, "DD.MM.yyyy");
        let time = moment(currentTime, "HH:mm");
        let start = moment(data.start, "HH:mm");
        let end = moment(data.end, "HH:mm");
        if (moment(selectedDate).isBefore(currentDate)) {
            data.isDisabled = true;
            data.isActive = false
        }
        if (moment(selectedDate).isAfter(currentDate)) {
            data.isDisabled = false;
        }
        if (moment(selectedDate).isSame(currentDate)) {
            if ((moment(time).isSameOrAfter(start) && moment(time).isBefore(end)) || (moment(time).isBefore(start))) {
                data.isDisabled = false
            } else {
                data.isDisabled = true;
                data.isActive = false
            }
            if ((moment(time).isSameOrAfter(start) && moment(time).isBefore(end))) {

                let element = document.getElementById(this.setId(data.start, this.index));
                element.scrollIntoView();
                this.currentInterval = data;

            }
        }

    }
    setId(id: string, index: number): string {
        return `${id}-${index}`
    }
    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
