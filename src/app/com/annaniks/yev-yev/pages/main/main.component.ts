import { DatePipe } from "@angular/common";
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
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
        { title: 'Ուղղություններ', path: '/dashboard/main-routes' },
        { title: 'Աշխատակիցներ', path: '/dashboard/moderator' },
        { title: 'Պատվերներ', path: '#' },
        { title: 'Կարգավորումներ', path: '/dashboard/settings' },

    ]
    isOpenNotification: boolean = false;
    notifications: Notification[] = []
    constructor(private _router: Router,private _datePipe:DatePipe, private _mainService: MainService) { }
    ngOnInit() {
        this.getUnseenNotifications()

        setInterval(() => {
            this.getUnseenNotifications()
        }, 10000)
    }
    getUnseenNotifications() {
        this._mainService.getUnseenNotifications().pipe(takeUntil(this.unsubscribe$)).subscribe((data: Notification[]) => {
            this.notifications = data
        })
    }
    formatDate(date){
        let selectDate=new Date(date);        
        this._datePipe.transform(selectDate,'dd.MM.yyyy HH:mm')
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
    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}