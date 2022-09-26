import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DailyDriverOrderType } from '../../../../core/models/daily-order.model';
import { SubrouteDetails } from '../../../../core/models/orders-by-hours';

@Component({
    selector: 'app-driver-order',
    templateUrl: 'driver-order.component.html',
    styleUrls: ['driver-order.component.scss'],
    providers: [DatePipe]
})
export class DriverOrderComponent {
    driverKeys = [];
    order: DailyDriverOrderType;
    driverRoutes: { driver: any }[] = [];
    @Input('order')
    set setOrder($event: DailyDriverOrderType) {
        this.order = $event;
        if (this.order && this.order.result) {
            this.driverRoutes = this.order.result;
            for (const orderResult of this.order.result) {
                orderResult.driver['routes'] = [];
                for (const item of this.order.sub_routes) {
                    if (orderResult.driver[item.id]?.length) {
                        orderResult.driver['routes'].push(orderResult.driver[item.id][0]);
                    }
                }
            }
            this.driverRoutes = this.order.result.sort((a: any, b: any) => {
                return new Date(a.driver.routes[0].date).getTime() - new Date(b.driver.routes[0].date).getTime();
            });
            this.driverRoutes = this.driverRoutes.reduce((r, a) => {
                r[a.driver.routes[0].date] = r[a.driver.routes[0].date] || [];
                r[a.driver.routes[0].date].push(a);
                return r;
            }, Object.create(null));
            this.driverKeys = Object.keys(this.driverRoutes);
        }

    }
}
