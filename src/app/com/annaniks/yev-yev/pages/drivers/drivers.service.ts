import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RouteItem } from "../../core/models/routes.model";
import { User } from "../../core/models/salary";
import { ServerResponce } from "../../core/models/server-reponce";

@Injectable()
export class DriverService {
    constructor(private _httpClient: HttpClient) { }
    getUsers(page: number,offset:number) {
        return this._httpClient.get<ServerResponce<User[]>>(`userdetails/user/?search=&user_role__code=DR&page=${page}&limit=10&offset=${offset}`)
    }
    public getUserById(userId: number) {
        return this._httpClient.get(`userdetails/user/?search=&user_role__code=DR&id=${userId}`)
    }
    public getAllRoutes() {
        return this._httpClient.get<ServerResponce<RouteItem[]>>(`route/main-route/`)
    }
    public getDriverOfMainRoute(page:number,offset:number){
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
    
}