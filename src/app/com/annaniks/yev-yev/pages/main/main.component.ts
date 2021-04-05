import { DatePipe } from "@angular/common";
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { forkJoin, Subject } from "rxjs";
import { map, switchMap, takeUntil } from "rxjs/operators";
import { Notification } from "../../core/models/notification";
import { MainService } from "./main.service";

@Component({
    selector: 'app-main',
    templateUrl: 'main.component.html',
    styleUrls: ['main.component.scss'],
    providers: [DatePipe]
})
export class MainComponent {
    unsubscribe$ = new Subject();
    public tabs = [
        { title: 'Վարորդներ', path: '/dashboard/driver' },
        { title: 'Ուղևորներ', path: '/dashboard/user' },
        { title: 'Երթեր', path: '/dashboard/main-routes' },
        { title: 'Պատվերներ', path: '/dashboard/orders' },
        { title: 'Աշխատակիցներ', path: '/dashboard/moderator' },
        { title: 'Այլ', path: '/dashboard/other-orders' },
        { title: 'Տվյալներ', path: '/dashboard/moderator-settings' },
        { title: 'Կարգավորումներ', path: '/dashboard/settings' },

    ]
    role: string;
    isOpenNotification: boolean = false;
    notifications: Notification[] = [];
    extraOrderCount: number;
    constructor(private _router: Router, private _datePipe: DatePipe, private _mainService: MainService, private _cookieService: CookieService) {
        this.role = this._cookieService.get('role')
    }
    ngOnInit() {
        this._getCounts()

        setInterval(() => {
            this._getCounts()
        }, 10000)
    }
    public logOut() {
        this._cookieService.delete('role');
        this._cookieService.delete('access');
        localStorage.removeItem('user')
        this._router.navigate(['/auth'])
    }
    private _getCounts() {
        const combine = forkJoin(
            this._getUnseenNotifications(),
            this._getExtrarderCount()
        )
        combine.pipe(takeUntil(this.unsubscribe$)).subscribe()
    }
    private _getExtrarderCount() {
        return this._mainService.getExtraOrdersCount().pipe(
            map((data: { count: number }) => {
                this.extraOrderCount = data.count;
                return data
            })
        )
    }
    private _getUnseenNotifications() {
        return this._mainService.getUnseenNotifications().pipe(
            map((data: Notification[]) => {
                this.notifications = data
            }))
    }
    formatDate(date) {
        let selectDate = new Date(date);
        this._datePipe.transform(selectDate, 'dd.MM.yyyy HH:mm')
    }
    closeNotificationItem() {
        this.isOpenNotification = false
    }
    openNotificationItem() {
        this.isOpenNotification = !this.isOpenNotification
    }
    sendQueryParams(notification: Notification) {
        let params = {
            date: notification.order_details.date,
            subRoute: notification.order_details.sub_route,
            mainRoute: notification.order_details.sub_route_details.main_route,
            status: notification.order_details.status
        }
        // notification.order_details.status
        return params
    }
    setSeenNotification(id: number) {
        this._mainService.setSeenNotification(id).pipe(takeUntil(this.unsubscribe$),
            switchMap(() => {
                return this._getUnseenNotifications()
            })).subscribe()
    }
    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}