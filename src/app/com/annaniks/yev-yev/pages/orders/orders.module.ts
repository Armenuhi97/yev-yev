import { NgModule } from "@angular/core";
import { SharedModule } from "../../core/shared/shared.module";
import { DriverOrderComponent, OrderClientComponent } from "./component";
import { OrdersComponent } from "./orders.component";
import { OrdersRoutingModule } from "./orders.routing.module";

@NgModule({
    declarations: [OrdersComponent, OrderClientComponent, DriverOrderComponent],
    imports: [OrdersRoutingModule, SharedModule]
})
export class OrdersModule { }