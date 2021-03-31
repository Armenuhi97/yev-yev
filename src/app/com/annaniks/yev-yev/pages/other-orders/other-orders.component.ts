import { DatePipe } from "@angular/common";
import { Component } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import * as moment from "moment";
import { NzMessageService } from "ng-zorro-antd/message";
import { forkJoin, Observable, of, Subject, throwError } from "rxjs";
import { catchError, map, switchMap, takeUntil } from "rxjs/operators";
import { ExtraOrders } from "../../core/models/extra-orders";
import { SubrouteDetails } from "../../core/models/orders-by-hours";
import { User } from "../../core/models/salary";
import { ServerResponce } from "../../core/models/server-reponce";
import { OpenTimesService } from "../../core/services/open-times.service";
import { OtherOrdesService } from "./other-orders.service";

@Component({
    selector: 'app-other-orders',
    templateUrl: 'other-orders.component.html',
    styleUrls: ['other-orders.component.scss'],
    providers: [DatePipe]
})
export class OtherOrdersComponent {
    subRoutes: SubrouteDetails[] = []
    total: number;
    pageIndex: number = 1;
    phoneNumberPrefix = new FormControl('+374')
    allDrivers: User[] = [];
    filteredDrivers: User[] = []
    extraOrders: ExtraOrders[] = [];
    pageSize: number = 10;
    unsubscribe$ = new Subject();
    validateForm: FormGroup;
    isEditing: boolean = false;
    isVisible: boolean = false;
    editIndex: number = null;
    editItem: ExtraOrders;
    public openTimes = []
    radioValue = 'pending';
    constructor(private _otherOrdersService: OtherOrdesService,
        private nzMessages: NzMessageService,
        private _router: Router,
        private _datePipe: DatePipe,
        private _fb: FormBuilder, private _openTimesService: OpenTimesService) {
        this.openTimes = this._openTimesService.getOpenTimes()
    }

    ngOnInit() {
        this._initForm();
        this.combineObservable()
    }
    getLabelOfDrivers(dr: User) {
        return `${dr.user.first_name} ${dr.user.last_name} (${dr.car_model}) (${dr.car_capacity})`
    }
    combineObservable() {
        const combine = forkJoin(
            this.getSubrouteList(),
            this.getExtraOrders()
        )
        combine.pipe(takeUntil(this.unsubscribe$)).subscribe()
    }
    changeStatus($event) {
        this.getExtraOrders().pipe(takeUntil(this.unsubscribe$)).subscribe()
    }
    getSubrouteList() {
        return this._otherOrdersService.getSubRouteList().pipe(
            map((data: ServerResponce<any>) => {
                this.subRoutes = data.results
            }))
    }
    getDrivers(mainRoute) {
        return this._otherOrdersService.getDrivers(mainRoute).pipe(
            map((data: ServerResponce<User[]>) => {
                console.log(data);

                this.allDrivers = data.results;
                this.filterDriver()
            },
                catchError(() => {
                    this.allDrivers = []
                    return throwError(false)
                }))
        )
    }

    filterDriver() {
        let personCount = this.validateForm.get('personCount').value;
        if (personCount) {
            let driver = this.validateForm.get('driver').value
            this.filteredDrivers = this.allDrivers.filter((val) => {
                return (+val.car_capacity >= personCount)
            })
            if (driver) {
                let findDriver = this.filteredDrivers.filter((val) => {
                    return (val.id == driver)
                })
                if (!findDriver || (findDriver && !findDriver.length)) {
                    this.validateForm.get('driver').reset()
                }
            }
        } else {
            this.filteredDrivers = []
        }
    }
    public getExtraOrders(): Observable<ServerResponce<ExtraOrders[]>> {
        return this._otherOrdersService.getExtraOrders((this.pageIndex - 1) * 10, this.radioValue).pipe(
            map((data: ServerResponce<ExtraOrders[]>) => {
                this.total = data.count;
                this.extraOrders = data.results;
                return data
            }))
    }
    compareTwoDates(orderDate) {
        let dateFormat = moment(orderDate).format('HH:mm')
        let date = moment(dateFormat, "HH:mm");
        // let date = this._datePipe.transform(new Date(item.hour), 'HH:mm');
        for (let time of this.openTimes) {
            let start = moment(time.start, "HH:mm");
            let end = moment(time.end, "HH:mm");
            if ((moment(date).isSameOrAfter(start) && moment(date).isBefore(end))) {
                return time.time


            }
        }
        return
    }
    onEditExtraOrders(index: number) {
        this.isEditing = true;
        this.editIndex = index;
        this.editItem = this.extraOrders[this.editIndex];
        let orderDate = this.editItem.connected_order_details.date;
        let date = new Date(orderDate);
        if (this.editItem && this.editItem.connected_order_details.sub_route_details) {
            let subrouteDetail = this.subRoutes.filter((el => { return el.id == this.editItem.connected_order_details.sub_route }));
            this.validateForm.patchValue({
                personCount: this.editItem.connected_order_details.person_count,
                subroute: (subrouteDetail && subrouteDetail.length) ? subrouteDetail[0] : null,
            })
            this.getDrivers(this.editItem.connected_order_details.sub_route_details.main_route).pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
                let phoneNumber = this.editItem.connected_order_details.phone_number
                this.validateForm.patchValue({
                    startPointAddress: this.editItem.connected_order_details.start_address,
                    endPointAddress: this.editItem.connected_order_details.end_address,
                    order_phone_number: phoneNumber ? phoneNumber.slice(4) : null,
                    driver: this.editItem.connected_order_details.client_details.id,
                    comment: this.editItem.connected_order_details.comment,
                    date: date,
                    time: this.compareTwoDates(date),
                })
            })
        } else {
            let phoneNumber = this.editItem.connected_order_details.phone_number
            let subrouteDetail = this.subRoutes.filter((el => { return el.id == this.editItem.connected_order_details.sub_route }));

            this.validateForm.patchValue({
                startPointAddress: this.editItem.connected_order_details.start_address,
                endPointAddress: this.editItem.connected_order_details.end_address,
                order_phone_number: phoneNumber ? phoneNumber.slice(4) : null,
                driver: this.editItem.connected_order_details.client_details.id,
                comment: this.editItem.connected_order_details.comment,
                date: date,
                time: this.compareTwoDates(date),
                personCount: this.editItem.connected_order_details.person_count,
                subroute: (subrouteDetail && subrouteDetail.length) ? subrouteDetail[0] : null,
            })
        }
        this.showModal()
    }
    onCancelOrder() {
        this._otherOrdersService.cancelExtraOrder(this.editItem.id).pipe(takeUntil(this.unsubscribe$),
            switchMap(() => {
                this.handleCancel();
                return this.getExtraOrders()
            })).subscribe()
    }

    nzPageIndexChange(page: number) {
        this.pageIndex = page;
        this.getExtraOrders().pipe(takeUntil(this.unsubscribe$)).subscribe()
    }
    private _initForm() {
        this.validateForm = this._fb.group({
            startPointAddress: [null],
            endPointAddress: [null],
            order_phone_number: [null, [Validators.minLength(8), Validators.maxLength(8)]],
            personCount: [null, Validators.required],
            subroute: [null, Validators.required],
            driver: [null, Validators.required],
            comment: [null],
            date: [null],
            time: [null]
        })
        this.validateForm.get('subroute').valueChanges.pipe(takeUntil(this.unsubscribe$),
            switchMap((value: SubrouteDetails) => {
                if (value && value.id) {
                    return this.getDrivers(value.main_route)
                } else {
                    return of()
                }
            })
        ).subscribe()
        this.validateForm.get('personCount').valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe((value) => {
            if (value) {
                this.filterDriver()
            }
        })
    }
    public showModal(): void {
        this.isVisible = true;
    }
    getLabel(subroute: SubrouteDetails) {
        return `${subroute.start_point_city.name_hy} - ${subroute.end_point_city.name_hy}`
    }

    handleCancel(): void {
        this.isVisible = false;
        this.isEditing = false;
        this.validateForm.reset();
        this.editIndex = null;
        this.editItem = null;
        this.allDrivers = [];
        this.filteredDrivers = []
    }
    onOrderSave() {
        console.log(this.validateForm);

        if (this.validateForm.valid) {
            if (this.editItem) {
                let date = this._datePipe.transform(this.validateForm.get('date').value, 'yyy-MM-dd');
                let time = this.validateForm.get('time').value.slice(0, this.validateForm.get('time').value.indexOf('-')).trim();
                let dateTime = `${date} ${time}`
                let sendResponse = {
                    "date": dateTime,
                    "extra_order_id": this.editItem.id,
                    "driver_id": this.validateForm.get('driver').value,
                    "sub_route_id": this.validateForm.get('subroute').value ? this.validateForm.get('subroute').value.id : null,
                    "comment": this.validateForm.get('comment').value,
                    "phone_number": this.validateForm.get('order_phone_number').value ? '+374' + this.validateForm.get('order_phone_number').value : null,
                    "start_address": this.validateForm.get('startPointAddress').value,
                    "end_address": this.validateForm.get('endPointAddress').value,
                    "person_count": this.validateForm.get('personCount').value
                }
                this._otherOrdersService.editExtraOrder(sendResponse).pipe(
                    takeUntil(this.unsubscribe$),
                    map(() => {
                        let mainRoute = this.validateForm.get('subroute').value.main_route
                        this.handleCancel();
                        let params = {
                            date: sendResponse.date,
                            subRoute: sendResponse.sub_route_id,
                            mainRoute: mainRoute
                        }
                        this._router.navigate(['/dashboard/main-routes',], { queryParams: params })

                        // return this.getExtraOrders()
                    })).subscribe()
            }
        }
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}