import { DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { forkJoin, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { ExtraOrders } from '../../core/models/extra-orders';
import { User } from '../../core/models/salary';
import { ServerResponce } from '../../core/models/server-reponce';
import { OtherOrdesService } from './other-orders.service';

@Component({
    selector: 'app-other-orders',
    templateUrl: 'other-orders.component.html',
    styleUrls: ['other-orders.component.scss'],
    providers: [DatePipe]
})
export class OtherOrdersComponent implements OnInit, OnDestroy {
    total: number;
    pageIndex = 1;
    allDrivers: User[] = [];
    filteredDrivers: User[] = [];
    extraOrders: ExtraOrders[] = [];
    pageSize = 10;
    unsubscribe$ = new Subject();
    radioValue = 'pending';
    constructor(
        private otherOrdersService: OtherOrdesService
    ) {
    }

    ngOnInit(): void {
        this.combineObservable();
    }

    getLabelOfDrivers(dr: User): string {
        return `${dr.user.first_name} ${dr.user.last_name} (${dr.car_model}) (${dr.car_capacity})`;
    }

    combineObservable(): void {
        const combine = forkJoin(
            this.getExtraOrders()
        );
        combine.pipe(takeUntil(this.unsubscribe$)).subscribe();
    }
    changeStatus($event): void {
        this.pageIndex = 1;
        this.getExtraOrders().pipe(takeUntil(this.unsubscribe$)).subscribe();
    }

    public getExtraOrders(): Observable<ServerResponce<ExtraOrders[]>> {
        return this.otherOrdersService.getExtraOrders((this.pageIndex - 1) * 10, this.radioValue).pipe(
            map((data: ServerResponce<ExtraOrders[]>) => {
                this.total = data.count;
                this.extraOrders = data.results;
                return data;
            }));
    }

    nzPageIndexChange(page: number): void {
        this.pageIndex = page;
        this.getExtraOrders().pipe(takeUntil(this.unsubscribe$)).subscribe();
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
