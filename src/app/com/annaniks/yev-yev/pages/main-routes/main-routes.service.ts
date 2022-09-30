import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { CountDto } from "../../core/models/dto/routes.dto.model";
import { OrderResponse } from "../../core/models/order";
import { Counts, RouteItem } from "../../core/models/routes.model";
import { ServerResponce } from "../../core/models/server-reponce";

@Injectable()
export class MainRoutesService {
    _date = '';
    constructor(private _httpClient: HttpClient) { }

    public getCounts(data:CountDto):Observable<Counts[]>{
      return this._httpClient.post<Counts[]>('order/get-counts/', data)
    }

    public getAllRoutes(page: number): Observable<ServerResponce<RouteItem[]>> {
        let offset = (page - 1) * 10;
        return this._httpClient.get<ServerResponce<RouteItem[]>>(`route/main-route/?only_my=True&page=${page}&limit=10&offset=${offset}`)
    }
    public getDrivers(mainRouteId: number) {
        return this._httpClient.get(`userdetails/user/?search=&driving_routes__main_route=${mainRouteId}&user_role__code=DR&limit=10000&small=true`)
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

    public getCloseHours(subRouteId: number, date: string) {

        return this._httpClient.get(`route/closed-hour/?sub_route=${subRouteId}&date=${date}&offset=0&limit=1000`)
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

    public getBlockedHours(subRouteId: number, date: string) {

        return this._httpClient.get(`route/blocked-hour/?sub_route=${subRouteId}&date=${date}&offset=0&limit=1000`)
    }
    public blockHour(subrouteId: number, date) {
        return this._httpClient.post(`route/blocked-hour/`, {
            "sub_route": subrouteId,
            "time": date
        })
    }
    public openBlockedHours(id: number) {
        return this._httpClient.delete(`route/blocked-hour/${id}/`)
    }
    public finishOrder(id: number) {
        return this._httpClient.get(`order/finish-approved-order/${id}/`)
    }

    // http://yev.annaniks.com/order/get-subroute-hourly-orders-by-date/   POST
    // {"sub_route_id":24,"date":"2022-02-14"}

    public getHourlyOrdersByDate(routeId: number, date: string) {
        return this._httpClient.post(`order/get-subroute-hourly-orders-by-date/`, {
            "sub_route_id": routeId,
            "date": date
        });
    }

    public getOrdersByHour(subrouteid: number, date: string, status: string) {
        return this._httpClient.post('order/get-orders-by-hour/', {
            "sub_route_id": subrouteid,
            "date": date,
            status: status
        })
    }
    public getUserByPhonenumber(phoneNumber) {
        return this._httpClient.get(`userdetails/user/?search=${phoneNumber}`)
    }
    public addOrder(body: OrderResponse) {
        return this._httpClient.post(`order/add-order/`, body)

    }
    public addApprovedOrder(body) {
        return this._httpClient.post(`order/approved-order/`, body)
    }
    public deleteApprovedOrder(id: number) {
        return this._httpClient.delete(`order/approved-order/${id}/`)
    }

    public editApprovedOrder(id: number, body) {
        return this._httpClient.put(`order/approved-order/${id}/`, body)
    }
    public getAllAprovedOrders(subrouteId: number, dateTime: string) {
        return this._httpClient.get(`order/approved-order/?sub_route_id=${subrouteId}&datetime=${dateTime}`)
    }
    public changeOrder(id: number, body) {
        return this._httpClient.put(`order/edit-order/${id}/`, body)
    }
    public changeOrderStatus(id: number) {
        return this._httpClient.post(`order/approve-order/${id}/`, {})
    }
    public deleteOrders(id: number) {
        return this._httpClient.post(`order/cancel-order/${id}/`, {})

    }
    public approveCancelation(id: number) {
        return this._httpClient.post(`order/approve-cancelation-order/${id}/`, {})
    }
    public cancelCancelation(id: number) {
        return this._httpClient.post(`order/cancel-cancelation-order/${id}/`, {})
    }
    public sendMessage(orderId: number) {
        return this._httpClient.get(`order/send-viber-message/?approved_order_id=${orderId}`)
    }
    public changeApprovedOrderGroup(orderId: number, driverId: number) {
        return this._httpClient.post('order/change-approved-order-group/',
            {
                "approved_order_id": orderId,
                "driver_id": driverId
            })
    }
    public removeAndCancelOrder(approvedOrderId: number, orderId: number) {
        return this._httpClient.post('order/remove-and-cancel-order/',
            {
                "approved_order_id": approvedOrderId,
                "order_id": orderId
            })
    }
    public getDoneRoutes(subrouteId: number) {
        // return this._httpClient.get(`order/approved-order/?sub_route_id=${subrouteId}&date=${date}&status=done&limit=1000&offset=${offset}`)
        return this._httpClient.get(`order/get-current-drivers/${subrouteId}/`)
    }
    public closeAllHours(date: string, id: number): Observable<void> {
        return this._httpClient.get<void>(`/route/closed-hour/close-by-subroute/?date=${date}&subroute_id=${id}`)
    }
    public removeAllCloseHour(date: string, id: number): Observable<void> {
        return this._httpClient.get<void>(`/route/closed-hour/close-by-subroute/?date=${date}&subroute_id=${id}&to_remove=true`)

    }
}
