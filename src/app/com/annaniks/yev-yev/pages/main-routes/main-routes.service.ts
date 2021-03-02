import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { OrderResponse } from "../../core/models/order";
import { RouteItem } from "../../core/models/routes.model";
import { ServerResponce } from "../../core/models/server-reponce";

@Injectable()
export class MainRoutesService {
    constructor(private _httpClient: HttpClient) { }
    public getAllRoutes(page: number): Observable<ServerResponce<RouteItem[]>> {
        return this._httpClient.get<ServerResponce<RouteItem[]>>(`route/main-route/?page=${page}`)
    }
    public getDrivers(mainRouteId:number) {
        return this._httpClient.get(`userdetails/user/?search=&driving_routes__main_route=${mainRouteId}user_role__code=DR`)
    }
    public getRoutesById(id: number): Observable<RouteItem> {
        return this._httpClient.get<RouteItem>(`route/main-route/${id}/`)

    }
    public getSubRoute(routeId: number) {
        return this._httpClient.get(`route/sub-route/?main_route=${routeId}`)
    }
    public addUser(body) {
        return this._httpClient.post(`userdetails/add-moderator/`, body)
    }
    public getOrdersByHour(subrouteid: number, date: string) {
        return this._httpClient.post('order/get-orders-by-hour/', {
            "sub_route_id": subrouteid,
            "date": date
        })
    }
    public getCloseHours(subRouteId: number) {
        return this._httpClient.get(`route/closed-hour/?sub_route=${subRouteId}`)
    }
    public closeHours(subrouteId: number, date) {
        return this._httpClient.post(`route/closed-hour/`, {
            "sub_route": subrouteId,
            "time": date
        })
    }
    public openHours(id: number) {
        return this._httpClient.delete(`route/closed-hour/${id}/`)
    }
    public getHourlyOrdersByDate(routeId: number, date: string) {
        return this._httpClient.post(`order/get-hourly-orders-by-date/`, {
            "route_id": routeId,
            "date": date
        })
    }
    public getOrdersTypes() {
        return this._httpClient.get(`utils/order-type/`)
    }
    public getUserByPhonenumber(phoneNumber) {
        return this._httpClient.get(`userdetails/user/?search=${phoneNumber}&user_role__code=CL`)
    }
    public addOrder(body: OrderResponse) {
        return this._httpClient.post(`order/add-order/`, body)

    }
}