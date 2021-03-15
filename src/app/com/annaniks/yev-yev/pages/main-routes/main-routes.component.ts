import { DatePipe } from "@angular/common";
import { Component } from "@angular/core";
import { forkJoin, Subject, throwError } from "rxjs";
import { catchError, map, switchMap, takeUntil } from "rxjs/operators";
import { RouteItem } from "../../core/models/routes.model";
import { User } from "../../core/models/salary";
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
    orderTypes=[];
    drivers:User[]
    constructor(private _mainRoutesService: MainRoutesService, private _datePipe: DatePipe) { }
    ngOnInit() {
        this.combine()
    }
    combine() {
        const combine = forkJoin(
            this.getAllRoutes(),
            this.getAllOrdersTypes()
        )
        combine.pipe(takeUntil(this.unsubscribe$)).subscribe()
    }
    getAllRoutes() {
        return this._mainRoutesService.getAllRoutes(1).pipe(map((data: ServerResponce<RouteItem[]>) => {
            this.mainRoutes = data.results
        }))
    }

    getAllOrdersTypes() {
        return this._mainRoutesService.getOrdersTypes().pipe(map((data: ServerResponce<RouteItem[]>) => {
            this.orderTypes = data.results;            
        }))
    }
    getHourlyOrdersByDate(id: number) {
        let date = this._datePipe.transform(this.selectedDate, 'yyyy-MM-dd');
        return this._mainRoutesService.getHourlyOrdersByDate(id, date).pipe(
            map((data: any) => {
                this.closeCalendar()
                this.subRouteInfo = this.subRouteInfo.map((item, index) => { return Object.assign({}, item, { countList: data[index] }) });
            })
        )
    }
    getRouteInfo(id) {
       return this._mainRoutesService.getSubRoute(id).pipe(
            switchMap((data: ServerResponce<any>) => {
                this.subRouteInfo = data.results;
                return this.getHourlyOrdersByDate(id)
            }))
    }

    onChangeTab($event) {
        this.currentId = this.mainRoutes[$event].id
        this.combineObservable()
        
    }
    combineObservable(){
        const combine=forkJoin(
            this.getRouteInfo(this.currentId),
            this.getDrivers()
        )
        combine.pipe(takeUntil(this.unsubscribe$)).subscribe()
    }
    getDrivers(){
        return this._mainRoutesService.getDrivers(this.currentId).pipe(
            map((data:ServerResponce<User[]>)=>{
                this.drivers=data.results
            },
            catchError(()=>{                
                this.drivers=[]
                return throwError(false)
            }))
        )
    }
    openCalendar($event) {        
        this.isOpenCalendar = !this.isOpenCalendar;
        if ($event) {          
            this.getHourlyOrdersByDate(this.currentId).pipe(takeUntil(this.unsubscribe$)).subscribe()
        }

    }
    closeCalendar(){
        this.isOpenCalendar=false;
    }

    changeDate(type: number) {
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