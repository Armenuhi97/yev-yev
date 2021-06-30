import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Notification } from "../../models/notification";

@Component({
    selector: 'app-notification',
    templateUrl: 'notification.component.html',
    styleUrls: ['notification.component.scss']
})
export class NotificationComponent {
    isOpenNotification: boolean = false;
    notifications: Notification[] = [];
    @Input('notification')
    set setNotification($event) {
        this.notifications = $event
    }
    public type: string
    @Input('type')
    set setType($event: string) {
        this.type = $event
    }
    @Output('seenNotification') _seen = new EventEmitter();
    role: string
    constructor(private _cookieService: CookieService) {
        this.role = this._cookieService.get('role')
    }
    closeNotificationItem() {
        this.isOpenNotification = false
    }
    openNotificationItem() {
        this.isOpenNotification = !this.isOpenNotification
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

}