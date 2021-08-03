import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Subject } from "rxjs";
import { finalize, takeUntil } from "rxjs/operators";
import { MainService } from "../../../pages/main/main.service";
import { Notification } from "../../models/notification";
import { LoaderService } from "../../services/loaders.service";

@Component({
    selector: 'app-notification',
    templateUrl: 'notification.component.html',
    styleUrls: ['notification.component.scss']
})
export class NotificationComponent {
    unsubscribe$ = new Subject();

    public pageIndex: number = 1;
    public infiniteScrollDisabled: boolean = false;
    public throttle = 300;
    public scrollDistance = 1;
    public scrollUpDistance = 2
    isOpenNotification: boolean = false;
    notifications: Notification[] = [];
    @Input('count') count: number;

    public type: string
    @Input('type')
    set setType($event: string) {
        this.type = $event
    }
    @Output('seenNotification') _seen = new EventEmitter();
    role: string
    constructor(private _cookieService: CookieService,
        private _mainService: MainService,
        private _loaderService: LoaderService
    ) {
        this.role = this._cookieService.get('role')
    }
    closeNotificationItem() {
        this.isOpenNotification = false;
        this.pageIndex = 1;
        this.notifications = []
    }

    public openNotificationItem() {
        this.isOpenNotification = !this.isOpenNotification;
        if (this.isOpenNotification) {
            this.pageIndex = 1;
            this.notifications = [];
            this._loaderService.setHttpProgressStatus(true)
            this.getNotifications(true)
        }
    }

    async getNotifications(isHide?: boolean) {

        this.infiniteScrollDisabled = true;
        const data = await this._mainService.getUnseenNotifications(this.type, (this.pageIndex - 1) * 10)
            .pipe(takeUntil(this.unsubscribe$),
                finalize(() => {
                    if (isHide) {
                        this._loaderService.setHttpProgressStatus(false)
                    }
                })
            ).toPromise()

        this.notifications.push(...data.results);

        this.pageIndex++;
        this.infiniteScrollDisabled = false;

    }
    public async onScroll() {
        if (this.notifications.length >= this.count) {
            return;
        }
        this.getNotifications();
    }
    setSeenNotification(id: number) {
        this._seen.emit(id)
    }
    setSeenAllNotification() {
        this._seen.emit('all')

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
    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}