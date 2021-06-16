import { Component } from "@angular/core";
import { forkJoin, Subject } from "rxjs";
import { map, takeUntil } from "rxjs/operators";
import { CityItem } from "../../core/models/city.model";
import { RouteItem } from "../../core/models/routes.model";
import { ServerResponce } from "../../core/models/server-reponce";
import { OtherRoutesTime } from "../../core/models/ther-routes-time";
import { SettingsService } from "./setting.service";

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
    otherRoutesTime:OtherRoutesTime[]=[]
    constructor(private _settingsService: SettingsService) { }

    ngOnInit() {
        this.combineObservable()
    }
    combineObservable() {
        forkJoin(
            this.getAllRoutes(),
            this.getAllcities(),
            this.getAllPhones(),
            this.getOtherRoutesTimes()
        ).pipe(takeUntil(this.unsubscribe$)).subscribe()
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