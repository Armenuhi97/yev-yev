import { DatePipe } from "@angular/common";
import { IRoutePrice } from "../../../core/models/route-price";

export class RouteParamsDto {
    sub_route: number;
    day: number;
    time: string;
    price: number;
    constructor(data: IRoutePrice, dayIndex: number, subRouteId: number, datePipe: DatePipe) {
        this.sub_route = subRouteId;
        this.day = dayIndex;
        this.time = datePipe.transform(data.time, 'HH:mm');
        this.price = data.price;
    }
}