import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ExtraOrders } from "../../core/models/extra-orders";
import { ServerResponce } from "../../core/models/server-reponce";

@Injectable()
export class OtherOrdesService {
    constructor(private _httpClient: HttpClient) { }
    public getExtraOrders(offset: number,status):Observable<ServerResponce<ExtraOrders[]>> {
        return this._httpClient.get<ServerResponce<ExtraOrders[]>>(`order/extra-order/?limit=10&offset=${offset}&status=${status}`)
    }
    public cancelExtraOrder(id: number) {
        return this._httpClient.get(`order/cancel-extra-order/${id}/`)
    }
    public getSubRouteList(){
        return this._httpClient.get(`route/sub-route/`)
    }
    public getDrivers(mainRouteId: number) {
        
        return this._httpClient.get(`userdetails/user/?search=&id=&driving_routes__main_route=${mainRouteId}&user__is_active=true&has_moderating_permission=&user_role__code=DR`)
    }
    public editExtraOrder(body){
        return this._httpClient.post(`order/from-extra-to-usual-order/`,body)
    }
}