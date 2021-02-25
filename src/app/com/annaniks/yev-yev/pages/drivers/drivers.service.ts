import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RouteItem } from "../../core/models/routes.model";
import { User } from "../../core/models/salary";
import { ServerResponce } from "../../core/models/server-reponce";

@Injectable()
export class DriverService {
    constructor(private _httpClient: HttpClient) { }
    getUsers(page: number) {
        return this._httpClient.get<ServerResponce<User[]>>(`userdetails/user/?search=&user_role__code=DR&page=${page}`)
    }
    public getUserById(userId: number) {
        return this._httpClient.get(`userdetails/user/?search=&user_role__code=DR&id=${userId}`)
    }
    public getAllRoutes() {
        return this._httpClient.get<ServerResponce<RouteItem[]>>(`route/main-route/`)
    }
    public getDriverOfMainRoute(routeId:number){
        return this._httpClient.get(`route/main-route-driver/${routeId}/`)
    }
    public deleteUserById(userId: number) {
        return this._httpClient.delete(`userdetails/delete-user-details/${userId}/`)
    }
    public editUser(userId: number, body) {
        return this._httpClient.put(`userdetails/edit-user-details/${userId}/`, body)
    }
    public addUser(body) {
        return this._httpClient.post(`userdetails/add-driver/`, body)
    }
    public addMainRouteToDriver(mainRouteId: number, userId: number) {
        return this._httpClient.post('route/main-route-driver/', {
            "main_route": mainRouteId,
            "user": userId
        })
    }
    public editMainRouteToDriver(id: number, mainRouteId: number, userId: number) {
        return this._httpClient.post(`route/main-route-driver/${id}/`, {
            "main_route": mainRouteId,
            "user": userId
        })
    }
    
}