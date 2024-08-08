import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CityItem } from "../../core/models/city.model";
import { RouteItem } from "../../core/models/routes.model";
import { ServerResponce } from "../../core/models/server-reponce";
import { OtherRoutesTime } from "../../core/models/ther-routes-time";
import { ISeatsPrice, ISeatsPriseFormatted, SeatsName } from "../../core/models/seats-price";
import { map } from "rxjs/operators";
import { seatsPriceListNormalizer } from "./normalizers/seats-price.normalize";
import { IRoutePrice } from "../../core/models/route-price";

@Injectable()
export class SettingsService {
    constructor(private _httpClient: HttpClient) { }
    public getAllRoutes(page: number): Observable<ServerResponce<RouteItem[]>> {
        let offset = (page - 1) * 10;
        return this._httpClient.get<ServerResponce<RouteItem[]>>(`route/main-route/?only_my=True&page=${page}&limit=10&offset=${offset}`)
    }
    public addRoutes(name: string) {
        return this._httpClient.post(`route/main-route/`, { route_name: name })
    }
    public getRouteById(id: number): Observable<RouteItem> {
        return this._httpClient.get<RouteItem>(`route/main-route/${id}/`)
    }
    public getRouteSubList(mainId?: number, page: number = 1) {
        const offset = (page - 1) * 10;
        return this._httpClient.get(`route/sub-route/?main_route=${mainId || ''}&page=${page}&limit=10&offet=${offset}`)
    }
    public editSubRoute(subRouteId: number, body) {
        return this._httpClient.put(`route/sub-route/${subRouteId}/`, body)
    }
    public addSubRoute(body) {
        return this._httpClient.post(`route/sub-route/`, body)
    }
    getUsers() {
        return this._httpClient.get(`userdetails/user/?search=&user_role__code=MDR`)
    }
    addModeratorForRoute(routeId: number, userId: number) {
        return this._httpClient.post(`route/main-route-moderator/`, {
            "main_route": routeId,
            "user": userId
        })
    }
    public editRoute(id: number, name: string) {
        return this._httpClient.put(`route/main-route/${id}/`, { route_name: name })
    }
    public deleteRoute(id: number) {
        return this._httpClient.delete(`route/main-route/${id}/`)
    }

    public getAllCities(page: number): Observable<ServerResponce<CityItem[]>> {
        let offset = (page - 1) * 10;
        return this._httpClient.get<ServerResponce<CityItem[]>>(`utils/city/?page=${page}&limit=10&offset=${offset}`)
    }
    public addCity(body: CityItem) {
        return this._httpClient.post(`utils/city/`, body)
    }
    public getCityById(id: number): Observable<CityItem> {
        return this._httpClient.get<CityItem>(`utils/city/${id}/`)
    }
    public editCity(id: number, body: CityItem) {
        return this._httpClient.put(`utils/city/${id}/`, body)
    }
    public deleteCity(id: number) {
        return this._httpClient.delete(`utils/city/${id}/`)
    }


    public getAllphone(page: number) {
        let offset = (page - 1) * 10;
        return this._httpClient.get(`utils/contact-information/?page=${page}&limit=10&offset=${offset}`)
    }
    public addphone(body) {
        return this._httpClient.post(`utils/contact-information/`, body)
    }
    public getphoneById(id: number) {
        return this._httpClient.get(`utils/contact-information/${id}/`)
    }
    public editphone(id: number, body) {
        return this._httpClient.put(`utils/contact-information/${id}/`, body)
    }
    public deletephone(id: number) {
        return this._httpClient.delete(`utils/contact-information/${id}/`)
    }
    public getWorkingTimes() {
        return this._httpClient.get(`utils/general-settings/`)
    }
    public getOtherRoutesTimeList() {
        return this._httpClient.get('utils/general-settings/')
    }
    public editOtherRoutesTimeList(id: number, body: OtherRoutesTime) {
        return this._httpClient.put(`utils/general-settings/${id}/`, body)
    }
    public addOtherRoutesTimeList(body: OtherRoutesTime) {
        return this._httpClient.post(`utils/general-settings/`, body)
    }
    public getSeatsPrice(): Observable<ISeatsPriseFormatted[]> {
        return this._httpClient.get<ServerResponce<ISeatsPrice[]>>('utils/seats-price/').pipe(
            map((data) => {
                const result = data.results?.length ? data.results[0] : {} as ISeatsPrice;
                return seatsPriceListNormalizer(result);
            })
        );
    }
    public updateSeatsPrice(id: number, body) {
        return this._httpClient.put(`utils/seats-price/${id}/`, body);
    }
    public getRoutePrices(subRouteId: number) {
        return this._httpClient.get<ServerResponce<IRoutePrice[]>>(`route/prices/?sub_route=${subRouteId}`)
    }
    public updateRoutePrices(id: number, body: IRoutePrice) {
        return this._httpClient.put(`route/prices/${id}/`, body)
    }
}