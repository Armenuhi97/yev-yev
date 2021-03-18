import { Component, Input } from "@angular/core";
import { DailyUserOrderType } from "../../../../core/models/daily-order.model";
import { OrderType } from "../../../../core/models/order-type";
import { AppService } from "../../../../core/services/app.service";
import { OrderTypeService } from "../../../../core/services/order-type";

@Component({
    selector: 'app-order-client',
    templateUrl: 'order-client.component.html',
    styleUrls: ['order-client.component.scss']
})
export class OrderClientComponent {
    clientRoutes:DailyUserOrderType;
    title: string;
    orderTypes: OrderType[] = []
    @Input('order')
    set setOrder($event:DailyUserOrderType) {
        this.clientRoutes = $event;
        this.title = this.clientRoutes && this.clientRoutes.sub_route ? `${this.clientRoutes.sub_route.start_point_city.name_hy} ${this.clientRoutes.sub_route.end_point_city.name_hy}` : ''
    }
    constructor(private _appService: AppService, private _orderTypeService: OrderTypeService) {
        this.orderTypes = this._orderTypeService.getOrderTypes()
    }

    public checkAddress(moderator) {        
        if (this.clientRoutes.sub_route.start_point_is_static) {
            return moderator.end_address ? moderator.end_address : 'Հասցե չկա'
        } else {
            if (this.clientRoutes.sub_route.end_point_is_static) {
                return moderator.start_address ? moderator.start_address : 'Հասցե չկա'
            } else {
                return (moderator.start_address || moderator.end_address) ? `${moderator.start_address} - ${moderator.end_address}` : 'Հասցե չկա'
            }
        }
    }
    getOrderType(type: number): string {
        return this._appService.checkPropertyValue(this._appService.checkPropertyValue(this.orderTypes.filter((val) => { return +val.id == +type }), 0), 'name_en')
    }
}