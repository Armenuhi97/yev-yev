import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { DailyDriverOrderType } from '../../core/models/daily-order.model';
import { RouteItem } from '../../core/models/routes.model';
import { ServerResponce } from '../../core/models/server-reponce';
import { MainService } from '../main/main.service';
import { OrdersService } from '../../core/services/orders.service';

@Component({
  selector: 'app-driver-orders',
  templateUrl: './driver-orders.component.html',
  styleUrls: ['./driver-orders.component.scss']
})
export class DriverOrdersComponent implements OnInit, OnDestroy {
  activeIndex: number;
  activeDate: string;
  activeMainIndex: number;
  unsubscribe$ = new Subject();
  filterForm: FormGroup;
  mainRoutes: RouteItem[] = [];
  driverRoutes: any[] = [];
  driverKeys = [];
  isVisible = false;
  activeOrder;
  constructor(
    private fb: FormBuilder,
    private mainService: MainService,
    private datePipe: DatePipe,
    private ordersService: OrdersService) { }

  ngOnInit(): void {
    this.initFilterForm();
    this.getRoutes();
  }

  initFilterForm(): void {
    this.filterForm = this.fb.group({
      date: [new Date(), Validators.required],
      mainRoute: [null, Validators.required]
    });
  }

  getRoutes(): void {
    this.mainService.getAllRoutes(1).pipe(
      takeUntil(this.unsubscribe$),
      map((data: ServerResponce<RouteItem[]>) => {
        this.mainRoutes = data.results;
        if (this.mainRoutes && this.mainRoutes.length) {
          this.filterForm.get('mainRoute').setValue(this.mainRoutes[0].id);
        }
      })
    ).subscribe();
  }

  getDailyOrders(): void {
    const date = this.datePipe.transform(this.filterForm.get('date').value, 'yyyy-MM-dd');
    const mainRoute = this.filterForm.get('mainRoute').value;
    this.ordersService.getDriverMainRouteDailyOrders(mainRoute, date)
      .pipe(takeUntil(this.unsubscribe$)).subscribe((order: DailyDriverOrderType) => {
        this.groupOrderByDate(order);
      });

  }
  private groupOrderByDate(order): void {
    let drivers = [];
    const firstRoute = order.sub_routes[0];
    const lastRoute = order.sub_routes[1];
    if (order && order.result) {
      for (const orderResult of order.result) {
        for (const first of orderResult.driver[firstRoute.id]) {
          const orders = [first];
          if (orderResult.driver[lastRoute.id]?.length) {
            orderResult.driver[lastRoute.id] = orderResult.driver[lastRoute.id].sort((a: any, b: any) => {
              return new Date(a.date).getTime() - new Date(b.date).getTime();
            });
            orders.push(orderResult.driver[lastRoute.id][0]);
            orderResult.driver[lastRoute.id].splice(0, 1);
          }
          drivers.push({
            car_model: orderResult.driver.car_model,
            car_number: orderResult.driver.car_number,
            id: orderResult.driver.id,
            name: orderResult.driver.name,
            orders
          });
        }
      }
    }
    drivers = drivers.sort((a: any, b: any) => {
      return new Date(a.orders[0].date).getTime() - new Date(b.orders[0].date).getTime();
    });
    this.driverRoutes = drivers.reduce((r, a) => {
      r[a.orders[0].date] = r[a.orders[0].date] || [];
      r[a.orders[0].date].push(a);
      return r;
    }, Object.create(null));
    this.driverKeys = Object.keys(this.driverRoutes);
  }

  changeComment(order, date, activeMainIndex: number, index: number): void {
    this.activeOrder = order;
    this.isVisible = true;
    this.activeIndex = index;
    this.activeDate = date;
    this.activeMainIndex = activeMainIndex;
  }
  closeModal($event): void {
    this.isVisible = false;
    if ($event) {
      this.driverRoutes[this.activeDate][this.activeMainIndex].orders[this.activeIndex].comment_note = $event;
    }
    this.activeMainIndex = null;
    this.activeOrder = null;
    this.activeIndex = null;
    this.activeDate = null;

  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
