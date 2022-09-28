import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { DailyDriverOrderType, DailyUserOrderType } from '../../core/models/daily-order.model';
import { RouteItem } from '../../core/models/routes.model';
import { ServerResponce } from '../../core/models/server-reponce';
import { MainService } from '../main/main.service';
import { OrdersService } from '../../core/services/orders.service';

@Component({
    selector: 'app-orders',
    templateUrl: 'orders.component.html',
    styleUrls: ['orders.component.scss'],
    providers: [DatePipe]
})
export class OrdersComponent implements OnInit, OnDestroy {
    unsubscribe$ = new Subject();
    filterForm: FormGroup;
    mainRoutes: RouteItem[] = [];
    public person: string;
    public clientRoutes: DailyUserOrderType[];
    public driverRoutes: DailyDriverOrderType;
    persons = [{ key: 'driver', name: 'Վարորդ' }, { key: 'client', name: 'Ուղևոր' }]
    constructor(
        private fb: FormBuilder,
        private mainService: MainService,
        private datePipe: DatePipe,
        private ordersService: OrdersService) { }

    ngOnInit(): void {
        this.initFilterForm();
        this.getOrders();
    }

    initFilterForm(): void {
        this.filterForm = this.fb.group({
            date: [new Date(), Validators.required],
            person: ['driver', Validators.required],
            mainRoute: [null, Validators.required]
        });
    }

    getOrders(): void {
        this.mainService.getAllRoutes(1).pipe(
            takeUntil(this.unsubscribe$),
            map((data: ServerResponce<RouteItem[]>) => {
                this.mainRoutes = data.results;
                if (this.mainRoutes && this.mainRoutes.length) {
                    this.filterForm.get('mainRoute').setValue(this.mainRoutes[0].id)
                }
            })
        ).subscribe();
    }
    getDailyOrders(): void {
        const date = this.datePipe.transform(this.filterForm.get('date').value, 'yyyy-MM-dd');
        const mainRoute = this.filterForm.get('mainRoute').value;
        this.person = this.filterForm.get('person').value;
        if (this.filterForm.get('person').value === 'driver') {
            this.ordersService.getDriverMainRouteDailyOrders(mainRoute, date)
                .pipe(takeUntil(this.unsubscribe$)).subscribe((data: DailyDriverOrderType) => {
                    this.driverRoutes = data;
                });
        } else {
            this.ordersService.getMainRouteDailyOrders(mainRoute, date)
                .pipe(takeUntil(this.unsubscribe$)).subscribe((data: DailyUserOrderType[]) => {
                    this.clientRoutes = data;
                });
        }
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}