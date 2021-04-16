import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Observable } from "rxjs";
import { CityItem } from "../../core/models/city.model";
import { RouteItem } from "../../core/models/routes.model";
import { User } from "../../core/models/salary";
import { ServerResponce } from "../../core/models/server-reponce";
import { ViberInfo } from "../../core/models/viber";

@Injectable()
export class DriverService {
    constructor(private _httpClient: HttpClient) { }

    getUsers(page: number, offset: number, mainRouteId?: number) {
        let url = `userdetails/user/?search=&user_role__code=DR&page=${page}&limit=10&offset=${offset}`;
        if (mainRouteId) {
            url += `&driving_routes__main_route=${mainRouteId}`
        }
        return this._httpClient.get<ServerResponce<User[]>>(url)
    }
    public getUserById(userId: number) {
        return this._httpClient.get(`userdetails/user/?search=&user_role__code=DR&id=${userId}`)
    }
    public getAllRoutes() {

        return this._httpClient.get<ServerResponce<RouteItem[]>>('route/main-route/?only_my=True')
    }
    public getDriverOfMainRoute(page: number, offset: number) {
        return this._httpClient.get(`route/main-route-driver/?page=${page}&limit=10&offset=${offset}`)
    }
    public editUser(userId: number, body) {
        return this._httpClient.put(`userdetails/edit-user-details/${userId}/`, body)
    }
    public addUser(body) {
        return this._httpClient.post(`userdetails/add-driver/`, body)
    }
    public addMainRouteToDriver(body) {
        return this._httpClient.post('route/main-route-driver/', body)
    }
    public editMainRouteToDriver(id: number, mainRouteId: number, userId: number) {
        return this._httpClient.post(`route/main-route-driver/${id}/`, {
            "main_route": mainRouteId,
            "user": userId
        })
    }

    public deleteMainRouteToDriver(id: number) {
        return this._httpClient.delete(`route/main-route-driver/${id}/`)
    }
    public getDriverViberInfo(): Observable<ViberInfo[]> {
        return this._httpClient.get<ViberInfo[]>(`userdetails/get-drivers-viber-info/`)
    }
    public getOrders(driverId: number,page:number) {
        let offset=(page-1)*10;
        return this._httpClient.get(`order/approved-order/?driver_id=${driverId}&limit=10&offset=${offset}`)
    }
    public getAllCities(): Observable<ServerResponce<CityItem[]>> {
        return this._httpClient.get<ServerResponce<CityItem[]>>(`utils/city/?limit=100000`)
    }
}