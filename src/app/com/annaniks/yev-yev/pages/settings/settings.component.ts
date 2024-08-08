import { Component } from "@angular/core";
import { forkJoin, Subject } from "rxjs";
import { map, switchMap, takeUntil } from "rxjs/operators";
import { CityItem } from "../../core/models/city.model";
import { RouteItem } from "../../core/models/routes.model";
import { ServerResponce } from "../../core/models/server-reponce";
import { OtherRoutesTime } from "../../core/models/ther-routes-time";
import { SettingsService } from "./setting.service";
import { ISeatsPriseFormatted } from "../../core/models/seats-price";
import { SubrouteDetails } from "../../core/models/orders-by-hours";
import { IRoutePrice } from "../../core/models/route-price";

@Component({
    selector: 'app-settings',
    templateUrl: 'settings.component.html',
    styleUrls: ['settings.component.scss']
})
export class SettingsComponent {
    unsubscribe$ = new Subject();
    routeTotal: number
    routeTable: RouteItem[] = [];
    phoneTotal: number
    phoneTable: RouteItem[] = []
    cityTable: CityItem[] = []
    cityTotal: number;
    workingTimes;
    otherRoutesTime: OtherRoutesTime[] = [];
    seatsPriceList: ISeatsPriseFormatted[] = [];
    subRoutes: (SubrouteDetails | IRoutePrice)[] = [];
    constructor(private _settingsService: SettingsService) { }

    ngOnInit() {
        this.combineObservable()
    }
    combineObservable() {
        forkJoin([
            this.getAllRoutes(),
            this.getAllcities(),
            this.getAllPhones(),
            this.getOtherRoutesTimes(),
            this.getSeatsPriceList(),
        ]).pipe(takeUntil(this.unsubscribe$)).subscribe();
    }
    getOtherRoutesTimes() {
        return this._settingsService.getOtherRoutesTimeList().pipe(map((data: ServerResponce<OtherRoutesTime[]>) => {
            this.otherRoutesTime = data.results;
        }))
    }

    getAllRoutes() {
        return this._settingsService.getAllRoutes(1).pipe(map((data: ServerResponce<RouteItem[]>) => {
            this.routeTotal = data.count;
            this.routeTable = data.results;
        }))
    }
    private getSeatsPriceList() {
        return this._settingsService.getSeatsPrice().pipe(map((data) => {
            this.seatsPriceList = data;
        }));
    }
    getAllPhones() {
        return this._settingsService.getAllphone(1).pipe(map((data: ServerResponce<any[]>) => {
            this.phoneTotal = data.count;
            this.phoneTable = data.results;
        }))
    }
    public getAllcities() {
        return this._settingsService.getAllCities(1).pipe(map((data: ServerResponce<CityItem[]>) => {
            this.cityTotal = data.count;
            this.cityTable = data.results;
        }))
    }
    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}