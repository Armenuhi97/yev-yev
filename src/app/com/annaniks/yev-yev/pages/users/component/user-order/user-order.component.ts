import { DatePipe } from "@angular/common";
import { Component, Input } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ServerResponce } from "../../../../core/models/server-reponce";
import { UsersService } from "../../users.service";

@Component({
    selector: 'app-user-order',
    templateUrl: 'user-order.component.html',
    styleUrls: ['user-order.component.scss'],
    providers: [DatePipe]
})
export class UserOrderComponent {
    public pageIndex = 1;
    total: number;
    orders = [];
    pageSize: number = 10;
    unsubscribe$ = new Subject();
    userId: number;
    @Input('userId')
    set setOrders($event) {
        this.userId = $event;
        if (this.userId)
            this.getOrders()
    }
    constructor(private _userService: UsersService,
        private _datePipe: DatePipe) { }

    public getOrders() {
        this._userService.getOrders(this.userId, this.pageIndex).pipe(takeUntil(this.unsubscribe$)).subscribe((data: ServerResponce<any[]>) => {
            this.total = data.count;
            this.orders = data.results;
        })
    }
    transformDate(date) {
      return  this._datePipe.transform(date, 'dd-MM-YYYY')
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