import { Component, Input } from "@angular/core";
import { DailyDriverOrderType } from "../../../../core/models/daily-order.model";

@Component({
    selector: 'app-driver-order',
    templateUrl: 'driver-order.component.html',
    styleUrls: ['driver-order.component.scss']
})
export class DriverOrderComponent { 
    order:DailyDriverOrderType[]=[];
    @Input('order')
    set setOrder($event:DailyDriverOrderType[]){
        this.order=$event
    }
}