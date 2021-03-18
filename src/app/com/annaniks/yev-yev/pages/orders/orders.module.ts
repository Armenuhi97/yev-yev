import { NgModule } from "@angular/core";
import { SharedModule } from "../../core/shared/shared.module";
import { DriverOrderComponent,OrderClientComponent } from "./component";
import { OrdersComponent } from "./orders.component";
import { OrdersRoutingModule } from "./orders.routing.module";
import { OrdersService } from "./orders.service";

@NgModule({
    declarations: [OrdersComponent,OrderClientComponent,DriverOrderComponent],
    imports: [OrdersRoutingModule, SharedModule],
    providers:[OrdersService]
})
export class OrdersModule { }