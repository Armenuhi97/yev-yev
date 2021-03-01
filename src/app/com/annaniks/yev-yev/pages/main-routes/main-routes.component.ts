import { DatePipe } from "@angular/common";
import { Component } from "@angular/core";
import { Subject } from "rxjs";
import { map, switchMap, takeUntil } from "rxjs/operators";
import { RouteItem } from "../../core/models/routes.model";
import { ServerResponce } from "../../core/models/server-reponce";
import { MainRoutesService } from "./main-routes.service";

@Component({
    selector: 'app-main-routes',
    templateUrl: 'main-routes.component.html',
    styleUrls: ['main-routes.component.scss'],
    providers: [DatePipe]
})
export class MainRoutesComponent {
    selectedDate = new Date();
    subRouteInfo;
    public mainRoutes: RouteItem[] = [];
    unsubscribe$ = new Subject();
    isOpenCalendar: boolean = false;
    countsList = [];
    currentId: number;
    constructor(private _mainRoutesService: MainRoutesService, private _datePipe: DatePipe) { }
    ngOnInit() {
        this.getAllRoutes()
    }
    getAllRoutes() {
        this._mainRoutesService.getAllRoutes(1).pipe(takeUntil(this.unsubscribe$), map((data: ServerResponce<RouteItem[]>) => {
            this.mainRoutes = data.results
        })).subscribe()
    }
    getHourlyOrdersByDate(id: number) {
        console.log(id);
        
        let date = this._datePipe.transform(this.selectedDate, 'yyyy-MM-dd');
        return this._mainRoutesService.getHourlyOrdersByDate(id, date).pipe(
            map((data: any) => {
                this.subRouteInfo = this.subRouteInfo.map((item, index) => { return Object.assign({}, item, { countList: data[index] }) });
            })
        )
    }
    getRouteInfo(id) {
        this._mainRoutesService.getSubRoute(id).pipe(takeUntil(this.unsubscribe$),
            switchMap((data: ServerResponce<any>) => {
                this.subRouteInfo = data.results;
                console.log('3');
                
                return this.getHourlyOrdersByDate(id)
            })).subscribe()
    }

    onChangeTab($event) {
        this.currentId = this.mainRoutes[$event].id
        this.getRouteInfo(this.currentId)
    }
    openCalendar($event) {
        console.log('1');
        
        this.isOpenCalendar = !this.isOpenCalendar;
        this.getHourlyOrdersByDate(this.currentId).pipe(takeUntil(this.unsubscribe$)).subscribe()

    }

    changeDate(type: number) {
        console.log('2');
        
        let date = new Date(this.selectedDate)
        date.setDate(date.getDate() + type);
        this.selectedDate = new Date(date);
        this.getHourlyOrdersByDate(this.currentId).pipe(takeUntil(this.unsubscribe$)).subscribe()
    }
    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}