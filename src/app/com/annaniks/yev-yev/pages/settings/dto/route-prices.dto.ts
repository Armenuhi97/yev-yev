import { DatePipe } from "@angular/common";
import { IRoutePrice } from "../../../core/models/route-price";

export class RouteParamsDto {
    sub_route: number;
    sunday_price: number;
    sunday_time: string;
    monday_price: number;
    monday_time: string;
    tuesday_price: number;
    tuesday_time: string;
    wednesday_price: number;
    wednesday_time: string;
    thursday_price: number;
    thursday_time: string;
    friday_price: number;
    friday_time: string;
    saturday_price: number;
    saturday_time: string;
    is_active: boolean;
    constructor(data: IRoutePrice, subRouteId: number,datePipe:DatePipe) {
        this.sub_route = subRouteId;
        this.sunday_price = data.sunday_price;
        this.sunday_time = datePipe.transform(data.sunday_time,'HH:mm');
        this.monday_price = data.monday_price;
        this.monday_time = datePipe.transform(data.monday_time,'HH:mm');
        this.tuesday_price = data.tuesday_price;
        this.tuesday_time = datePipe.transform(data.tuesday_time,'HH:mm');
        this.wednesday_price = data.wednesday_price;
        this.wednesday_time = datePipe.transform(data.wednesday_time,'HH:mm');
        this.thursday_price = data.thursday_price;
        this.thursday_time = datePipe.transform(data.thursday_time,'HH:mm');
        this.friday_price = data.friday_price;
        this.friday_time = datePipe.transform(data.friday_time,'HH:mm');
        this.saturday_price = data.saturday_price;
        this.saturday_time = datePipe.transform(data.saturday_time,'HH:mm');
        this.is_active = data.is_active;
    }
}