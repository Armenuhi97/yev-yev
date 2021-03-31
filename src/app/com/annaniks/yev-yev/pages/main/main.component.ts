import { DatePipe } from "@angular/common";
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { Subject } from "rxjs";
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
    public tabs=[]
    public otherTabs = [
        { title: 'Աշխատակիցներ', path: '/dashboard/moderator' },
        { title: 'Կարգավորումներ', path: '/dashboard/settings' },
    ]
    public moderatorTabs=[
        { title: 'Վարորդներ', path: '/dashboard/driver' },
        { title: 'Ուղևորներ', path: '/dashboard/user' },
        { title: 'Ուղղություններ', path: '/dashboard/main-routes' },
        { title: 'Պատվերներ', path: '/dashboard/orders' },
        { title: 'Այլ', path: '/dashboard/other-orders' },
    ]
    isOpenNotification: boolean = false;
    notifications: Notification[] = []
    constructor(private _router: Router, private _datePipe: DatePipe, private _mainService: MainService,private _cookieService:CookieService) {
        if(this._cookieService.get('role') == 'ADM'){
            this.tabs=[...this.moderatorTabs,...this.otherTabs]
        }
     }
    ngOnInit() {
        this.getUnseenNotifications().pipe(takeUntil(this.unsubscribe$)).subscribe()

        setInterval(() => {
            this.getUnseenNotifications().pipe(takeUntil(this.unsubscribe$)).subscribe()
        }, 5000)
    }
    getUnseenNotifications() {
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
            mainRoute: notification.order_details.sub_route_details.main_route
        }
        return params
    }
    setSeenNotification(id: number) {
        this._mainService.setSeenNotification(id).pipe(takeUntil(this.unsubscribe$),
            switchMap(() => {
                return this.getUnseenNotifications()
            })).subscribe()
    }
    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}