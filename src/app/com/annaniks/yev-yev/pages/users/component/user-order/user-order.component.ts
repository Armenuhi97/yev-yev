import { Component, Input } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ServerResponce } from "../../../../core/models/server-reponce";
import { UsersService } from "../../users.service";

@Component({
    selector: 'app-user-order',
    templateUrl: 'user-order.component.html',
    styleUrls: ['user-order.component.scss']
})
export class UserOrderComponent {
    public pageIndex = 1;
    total: number;
    orders = [];
    pageSize: number = 10;
    unsubscribe$ = new Subject();
    @Input('orders')
    set setOrders($event) {
        this.orders = $event
    }
    constructor(private _userService: UsersService) { }
    public getOrders() {
        this._userService.getOrders(this.pageIndex).pipe(takeUntil(this.unsubscribe$)).subscribe((data: ServerResponce<any[]>) => {
            this.total = data.count;
            this.orders = data.results;
        })
    }
    nzPageIndexChange(page: number) {
        this.pageIndex = page;
        this.getOrders()
    }
    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}