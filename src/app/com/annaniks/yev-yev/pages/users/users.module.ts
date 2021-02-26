import { NgModule } from "@angular/core";
import { SharedModule } from "../../core/shared/shared.module";
import { UserOrderComponent } from "./component/user-order/user-order.component";
import { UersRoutingModule } from "./users-routing.module";
import { UsersComponent } from "./users.component";
import { UsersService } from "./users.service";

@NgModule({
    declarations: [UsersComponent,UserOrderComponent],
    imports: [UersRoutingModule, SharedModule],
    providers:[UsersService ]
})
export class UsersModule { }