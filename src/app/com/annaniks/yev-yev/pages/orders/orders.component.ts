import { DatePipe } from "@angular/common";
import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { forkJoin, Subject } from "rxjs";
import { map, takeUntil } from "rxjs/operators";
import { DailyDriverOrderType, DailyUserOrderType } from "../../core/models/daily-order.model";
import { RouteItem } from "../../core/models/routes.model";
import { ServerResponce } from "../../core/models/server-reponce";
import { MainService } from "../main/main.service";
import { OrdersService } from "./orders.service";

@Component({
    selector: 'app-orders',
    templateUrl: 'orders.component.html',
    styleUrls: ['orders.component.scss'],
    providers:[DatePipe]
})
export class OrdersComponent {
    unsubscribe$ = new Subject();
    filterForm: FormGroup;
    mainRoutes: RouteItem[] = [];
    public person:string;
    public clientRoutes:DailyUserOrderType[];
    public driverRoutes:DailyDriverOrderType;
    persons = [{ key: 'driver', name: 'Վարորդ' }, { key: 'client', name: 'Ուղևոր' }]
    constructor(private _fb: FormBuilder, private _mainService: MainService, 
        private _datePipe:DatePipe,
        private _ordersService: OrdersService) { }

    ngOnInit() {
        this.initFilterForm();
        this.getOrders()
    }

    initFilterForm() {
        this.filterForm = this._fb.group({
            date: [null, Validators.required],
            person: [null, Validators.required],
            mainRoute: [null, Validators.required]
        })
    }

    getOrders() {
        this._mainService.getAllRoutes(1).pipe(
            takeUntil(this.unsubscribe$),
            map((data: ServerResponce<RouteItem[]>) => {
                this.mainRoutes = data.results
            })
        ).subscribe()
    }
    getDailyOrders() {
        let date=this._datePipe.transform(this.filterForm.get('date').value,'yyyy-MM-dd');
        let mainRoute=this.filterForm.get('mainRoute').value;
        this.person=this.filterForm.get('person').value;
        if (this.filterForm.get('person').value == 'driver') {
            this._ordersService.getDriverMainRouteDailyOrders(mainRoute,date).pipe(takeUntil(this.unsubscribe$)).subscribe((data:DailyDriverOrderType)=>{
                this.driverRoutes=data
            })
        }else{
            this._ordersService.getMainRouteDailyOrders(mainRoute,date).pipe(takeUntil(this.unsubscribe$)).subscribe((data:DailyUserOrderType[])=>{
                this.clientRoutes=data
            })
        }
    }
  
    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}