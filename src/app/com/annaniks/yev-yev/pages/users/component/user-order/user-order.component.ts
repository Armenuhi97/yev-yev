import { DatePipe } from "@angular/common";
import { Component, Input, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ServerResponce } from "../../../../core/models/server-reponce";
import { UsersService } from "../../users.service";
import { HttpClient } from '@angular/common/http';
import { AppService } from "../../../../core/services/app.service";

@Component({
    selector: 'app-user-order',
    templateUrl: 'user-order.component.html',
    styleUrls: ['user-order.component.scss'],
    providers: [DatePipe]
})
export class UserOrderComponent implements OnDestroy {
    @Input() orders: any[] = [];
    @Input() total: number = 0;
    public pageIndex = 1;
    // total: number;
    pageSize: number = 10;
    unsubscribe$ = new Subject();
    userId: number;
    index: number = 0;
    @Input('userId')
    set setOrders($event) {
        this.userId = $event;
    }
    constructor(private _userService: UsersService,
        private _datePipe: DatePipe, private router: Router,
        private appService: AppService,
        private _httpClient: HttpClient) { }

    public getOrders() {
        this._userService.getOrders(this.userId, this.pageIndex)
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
        this.getOrders()
    }

    getAppovedOrder(index: number) {
        if (this.orders[index].approved_order_details.length) {
            this.index = this.orders[index]?.approved_order_details[0]?.approved_order?.id;
            this.appService.openNewTab('/dashboard/raiting-order', this.index);
            // this.router.navigate([`/dashboard/raiting-order/${this.index}`]);
        }
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}