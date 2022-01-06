import { NgModule } from "@angular/core";
import { SharedModule } from "../../core/shared/shared.module";
import { UserOrderComponent } from "./component/user-order/user-order.component";
import { UersRoutingModule } from "./users-routing.module";
import { UsersComponent } from "./users.component";
import { UsersService } from "./users.service";
import { UserReviewComponent } from './component/user-review/user-review.component';

@NgModule({
    declarations: [UsersComponent, UserOrderComponent, UserReviewComponent],
    imports: [UersRoutingModule, SharedModule],
    providers: [UsersService],
    exports: [UserOrderComponent, UserReviewComponent]
})
export class UsersModule { }