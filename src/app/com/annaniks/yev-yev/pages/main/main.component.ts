import { DatePipe } from "@angular/common";
import { Component, ElementRef, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { forkJoin, interval, Subject, Subscription } from "rxjs";
import { map, switchMap, takeUntil } from "rxjs/operators";
import { Notification } from "../../core/models/notification";
import { NotificationService } from "../../core/services/notification.service";
import { MainService } from "./main.service";

@Component({
    selector: 'app-main',
    templateUrl: 'main.component.html',
    styleUrls: ['main.component.scss'],
    providers: [DatePipe]
})
export class MainComponent {
    @ViewChild('audioOption') audio: ElementRef;
    unsubscribe$ = new Subject();
    public tabs = [
        { title: 'Վարորդներ', path: '/dashboard/driver' },
        { title: 'Ուղևորներ', path: '/dashboard/user' },
        { title: 'Վարկանիշ', path: '/dashboard/rating' },
        { title: 'Երթեր', path: '/dashboard/main-routes' },
        { title: 'Պատվերներ', path: '/dashboard/orders' },
        { title: 'Աշխատակիցներ', path: '/dashboard/moderator' },
        { title: 'Այլ', path: '/dashboard/other-orders' },
        { title: 'star', path: '/dashboard/star' },
        { title: 'Տվյալներ', path: '/dashboard/moderator-settings' },
        { title: 'Կարգավորումներ', path: '/dashboard/settings' },
        { title: 'address', path: '/dashboard/address' },
        { title: 'driver-orders', path: '/dashboard/driver-orders' },

    ];
    role: string;
    isOpenNotification = false;
    notifications: Notification[] = [];
    extraOrderCount: number;
    pendingCount: number;
    notificationCount: number;
    isOpenPendingNotification = false;
    pendiningNotification: Notification[] = [];
    subscription: Subscription;
    constructor(
        private _router: Router,
        private _datePipe: DatePipe,
        private _mainService: MainService,
        private _cookieService: CookieService,
        private notificationService: NotificationService) {
        this.role = this._cookieService.get('role');
    }
    ngOnInit() {
        this._getCounts().pipe(takeUntil(this.unsubscribe$)).subscribe();
        this.subscription = interval(10000).pipe(switchMap(() => {
            return this._getCounts();
        })).subscribe();
    }
    public logOut() {
        this._cookieService.delete('role');
        this._cookieService.delete('access');
        localStorage.removeItem('user');
        this._router.navigate(['/auth']);
    }
    private _getCounts() {
        return forkJoin([
            this._getExtrarderCount(),
            this._getUnseenNotificationCount(),
            this._getPendingNotificationCount()
        ]);
        // combine.pipe(takeUntil(this.unsubscribe$)).subscribe()
    }
    private _getUnseenNotificationCount() {
        return this._mainService.getUnseenNotificationCount().pipe(
            map((data: { count: number, notifications: Notification[] }) => {
                this.notificationCount = data.count;
                this.notificationService.setNotificationState(data.notifications);
                return data;
            })
        );
    }
    private _getExtrarderCount() {
        return this._mainService.getExtraOrdersCount().pipe(
            map((data: { count: number }) => {
                this.extraOrderCount = data.count;
                return data;
            })
        )
    }
    private _getPendingNotificationCount() {
        return this._mainService.getUnseenPendingNotificationCount().pipe(
            map((data: { count: number }) => {
                if (this.pendingCount !== data.count) {
                    setTimeout(() => {
                        this.playAudio();
                    }, 1000);

                }
                this.pendingCount = data.count;
                return data;
            })
        );
    }
    playAudio(): void {
        // if (this.audio?.nativeElement) {
        //     this.audio.nativeElement.play();
        // }
        let audio: any = document.createElement("AUDIO")
        document.body.appendChild(audio);
        audio.src = "../../../../../../assets/notification.mp3"
        audio.play()
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
    openPendingNotificationItem() {
        this.isOpenPendingNotification = !this.isOpenNotification
    }
    closePendingNotificationItem() {
        this.isOpenPendingNotification = false
    }
    sendQueryParams(notification: Notification) {
        let params = {
            date: notification.order_details.date,
            subRoute: notification.order_details.sub_route,
            mainRoute: notification.order_details.sub_route_details.main_route,
            status: notification.order_details.status
        }
        return params
    }
    setSeenNotification(evt: { id: string | number, isExtra: boolean }) {
        if (evt.id === 'all') {
            this._mainService.setSeenAllNotification().pipe(takeUntil(this.unsubscribe$),
                switchMap(() => {
                    return forkJoin(this._getUnseenNotificationCount(),
                        this._getPendingNotificationCount())
                })).subscribe()
        } else {
            if (!evt.isExtra) {
                this._mainService.setSeenNotification(+evt.id).pipe(takeUntil(this.unsubscribe$),
                    switchMap(() => {
                        return forkJoin(
                            this._getUnseenNotificationCount(),
                            this._getPendingNotificationCount());
                    })).subscribe();
            } else {
                this._mainService.setSeenExtraNotification(+evt.id).pipe(takeUntil(this.unsubscribe$),
                    switchMap(() => {
                        return forkJoin(
                            this._getUnseenNotificationCount(),
                            this._getPendingNotificationCount());
                    })).subscribe();
            }
        }
    }
    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}