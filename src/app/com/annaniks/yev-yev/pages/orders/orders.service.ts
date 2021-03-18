import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DailyDriverOrderType, DailyUserOrderType } from "../../core/models/daily-order.model";

@Injectable()
export class OrdersService{
    constructor(private _httpClient:HttpClient){}
    getMainRouteDailyOrders(mainRouteId:number,date:string):Observable<DailyUserOrderType[]>{
        return this._httpClient.get<DailyUserOrderType[]>(`order/get-main-route-daily-orders/${mainRouteId}/?date=${date}`)
    }
    getDriverMainRouteDailyOrders(mainRouteId:number,date:string):Observable<DailyDriverOrderType>{
        return this._httpClient.get<DailyDriverOrderType>(`order/get-dailiy-drivers-approved-orders/${mainRouteId}/?date=${date}`)

    }
}