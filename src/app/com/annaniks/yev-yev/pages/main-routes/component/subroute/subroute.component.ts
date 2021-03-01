import { DatePipe } from "@angular/common";
import { Component, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd/message";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ClosedHours } from "../../../../core/models/closed-hours";
import { Messages } from "../../../../core/models/mesages";
import { Client } from "../../../../core/models/salary";
import { ServerResponce } from "../../../../core/models/server-reponce";
import { MainRoutesService } from "../../main-routes.service";

@Component({
    selector: 'app-subroute',
    templateUrl: 'subroute.component.html',
    styleUrls: ['subroute.component.scss'],
    providers: [DatePipe]
})
export class SubrouteComponent {
    public subrouteInfo;
    private _selectedTime;
    isVisible: boolean = false;
    unsubscribe$ = new Subject();
    validateForm: FormGroup;
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
        if (this.isOpenInfo && this._selectedTime) {
            this.getInfo(this._selectedTime)
        }

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
    userInfo = []
    constructor(private _fb: FormBuilder,
        private _datePipe: DatePipe,
        private _mainRouteService: MainRoutesService,
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
            first_name: [null, Validators.required],
            last_name: [null, Validators.required],
            phone_number: [null, Validators.required],
            comment: [null]
        })
    }
    getInfo(time) {        
        this._selectedTime = time
        this.isOpenInfo = true;
        let current = this._formatDate(time)
        this._mainRouteService.getOrdersByHour(this.subrouteInfo.id, current).pipe(takeUntil(this.unsubscribe$)).subscribe((data: any) => {
            this.userInfo = data
        })
    }
    private _formatDate(time) {
        let date = this._datePipe.transform(this._date, 'yyyy-dd-MM');
        let currenTime = time.slice(0, time.indexOf(' '))
        let current = `${date} ${currenTime}`;
        return current
    }
    public showModal(): void {
        this.isVisible = true;
    }
    handleCancel(): void {
        this.isVisible = false;
        this.validateForm.reset();

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
        let sendObject = {
            "first_name": this.validateForm.get('first_name').value,
            "last_name": this.validateForm.get('last_name').value,
            "phone_number": this.validateForm.get('phone_number').value,
            "image": '',
            "comment": this.validateForm.get('comment').value,
        }
        this.sendRequest(sendObject);
    }
    sendRequest(sendObject) {
        this._mainRouteService.addUser(sendObject).pipe(takeUntil(this.unsubscribe$)).subscribe((data: Client) => {
            this.nzMessages.success(Messages.success)
            this.closeModal();
            // this.pageIndex = 1
            // this.getUsers()
        },
            () => {
                this.nzMessages.error(Messages.fail)
            })

    }
    closeModal(): void {
        this.isVisible = false;
        this.validateForm.reset();

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