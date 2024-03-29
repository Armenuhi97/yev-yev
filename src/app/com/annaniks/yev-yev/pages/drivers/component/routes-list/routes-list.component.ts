import { DatePipe } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ServerResponce } from "../../../../core/models/server-reponce";
import { AppService } from "../../../../core/services/app.service";
import { DriverService } from "../../drivers.service";


@Component({
    selector: 'app-routes-list',
    templateUrl: 'routes-list.component.html',
    styleUrls: ['routes-list.component.scss']
})
export class RoutesListComponent implements OnInit {
    @Input() orders: any[] = [];
    @Input() total: number = 0;
    public pageIndex = 1;
    // total: number;
    pageSize: number = 10;
    unsubscribe$ = new Subject();
    userId: number;
    @Input('userId')
    set setOrders($event) {
        this.userId = $event;
    }

    constructor(
        private _driverService: DriverService,
        private _datePipe: DatePipe,
        private appService: AppService,
        private router: Router) { }

    ngOnInit(): void { }



    public getOrders() {
        this._driverService.getOrders(this.userId, this.pageIndex)
            .pipe(takeUntil(this.unsubscribe$)).subscribe((data: ServerResponce<any[]>) => {
                this.total = data.count;
                this.orders = data.results;
            });
    }
    transformDate(date) {
        return this._datePipe.transform(date, 'dd-MM-YYYY HH:mm')
    }
    public checkAddress(data) {
        if (data && data.sub_route_details) {
            if (data.sub_route_details.start_point_is_static) {

                return data.end_address ? data.end_address : 'Հասցե չկա'
            } else {

                if (data.sub_route_details.end_point_is_static) {

                    return data.start_address ? data.start_address : 'Հասցե չկա'
                } else {
                    return (data.start_address || data.end_address) ? `${data.start_address} - ${data.end_address}` : 'Հասցե չկա'
                }
            }
        }
    }
    nzPageIndexChange(page: number) {
        this.pageIndex = page;
        this.getOrders();
    }


    public getAppovedOrder(id: number): void {
        this.appService.openNewTab('/dashboard/raiting-order', id);
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}