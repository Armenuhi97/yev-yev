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

    order: DailyDriverOrderType;
    @Input('order')
    set setOrder($event: DailyDriverOrderType) {
        this.order = $event;
        if (this.order && this.order.result) {
            for (let orderResult of this.order.result) {
                orderResult['array'] = []
                for (let item of this.order.sub_routes) {
                    for (let subroute of orderResult.driver[item.id]) {
                        // subroute.date=new Date(subroute.date)
                        subroute['routeName'] = `${item.start_point_city.name_hy} - ${item.end_point_city.name_hy}`;
                        orderResult.array.push(subroute);
                    }

                }
                orderResult.array = orderResult.array.sort((a: any, b: any) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
                );
            }
            this.order.result = this.order.result.sort((a: any, b: any) =>
                new Date(a.array[0].date).getTime() - new Date(b.array[0].date).getTime()
            );
        }
    }
}
