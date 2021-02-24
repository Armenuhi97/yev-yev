import { Component } from "@angular/core";
import { forkJoin, Subject } from "rxjs";
import { map, takeUntil } from "rxjs/operators";
import { CityItem } from "../../core/models/city.model";
import { RouteItem } from "../../core/models/routes.model";
import { ServerResponce } from "../../core/models/server-reponce";
import { SettingsService } from "./setting.service";

@Component({
    selector: 'app-settings',
    templateUrl: 'settings.component.html',
    styleUrls: ['settings.component.scss']
})
export class SettingsComponent {
    unsubscribe$ = new Subject();
    routeTotal: number
    routeTable: RouteItem[] = []
    cityTable: CityItem[] = []
    cityTotal: number
    constructor(private _settingsService: SettingsService) { }

    ngOnInit() {
        this.combineObservable()
    }
    combineObservable() {
        forkJoin(
            this.getAllRoutes(),
            this.getAllcities()
        ).pipe(takeUntil(this.unsubscribe$)).subscribe()
    }
    getAllRoutes() {
        return this._settingsService.getAllRoutes(1).pipe(map((data: ServerResponce<RouteItem[]>) => {
            this.routeTotal = data.count;
            this.routeTable = data.results;            
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