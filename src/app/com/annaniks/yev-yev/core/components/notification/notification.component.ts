import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Subject } from "rxjs";
import { finalize, takeUntil } from "rxjs/operators";
import { MainService } from "../../../pages/main/main.service";
import { Notification, PendingNotification } from "../../models/notification";
import { LoaderService } from "../../services/loaders.service";

@Component({
    selector: 'app-notification',
    templateUrl: 'notification.component.html',
    styleUrls: ['notification.component.scss']
})
export class NotificationComponent {
    unsubscribe$ = new Subject<void>();
    public pageIndex = 1;
    public infiniteScrollDisabled = false;
    public throttle = 300;
    public scrollDistance = 1;
    public scrollUpDistance = 2;
    isOpenNotification = false;
    notifications: Notification[] = [];
    @Input('count') count: number;

    public type: string;
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
        this.role = this._cookieService.get('role');
    }
    closeNotificationItem() {
        this.isOpenNotification = false;
        this.pageIndex = 1;
        this.notifications = [];
    }

    public openNotificationItem() {
        this.isOpenNotification = !this.isOpenNotification;
        if (this.isOpenNotification) {
            this.pageIndex = 1;
            this.notifications = [];
            this._loaderService.setHttpProgressStatus(true);
            this.getNotifications(true);
        }
    }

    async getNotifications(isHide?: boolean) {
        this.infiniteScrollDisabled = true;
        const data = await this._mainService.getUnseenNotifications(this.type, this.pageIndex)
            .pipe(takeUntil(this.unsubscribe$),
                finalize(() => {
                    if (isHide) {
                        this._loaderService.setHttpProgressStatus(false)
                    }
                })
            ).toPromise();
        const result = data.results;
        if (this.type === 'pending') {
            result.extra_orders = result.extra_orders.map((res) => {
                return {
                    ...res,
                    order_details: res.connected_order_details
                };
            });
            const combineArray = [...result.extra_orders, ...result.orders];
            this.notifications.push(...combineArray);
        } else {
            this.notifications.push(...result);
        }

        this.pageIndex++;
        this.infiniteScrollDisabled = false;

    }
    public async onScroll() {
        if (this.notifications.length >= this.count) {
            return;
        }
        this.getNotifications();
    }
    setSeenNotification(item): void {
        const isExtra = this.checkIsExtra(item);
        this._seen.emit({ id: item.id, isExtra });
    }
    private checkIsExtra(item): boolean {
        return item?.order_details?.is_extra_order ? true : false;
    }
    setSeenAllNotification(): void {
        this._seen.emit({ id: 'all' });
    }

    sendQueryParams(notification: Notification) {
        if (this.checkIsExtra(notification)) {
            return {};
        }
        const params = {
            date: notification.order_details.date,
            subRoute: notification.order_details.sub_route,
            mainRoute: notification.order_details?.sub_route_details?.main_route,
            status: notification.order_details.status
        };
        return params;
    }
    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}