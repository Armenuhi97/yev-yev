import { NgModule } from "@angular/core";
import { SharedModule } from "../../core/shared/shared.module";
import { OtherOrdersComponent } from "./other-orders.component";
import { OtherOrdersRoutingModule } from "./other-orders.routing.module";
import { OtherOrdesService } from "./other-orders.service";
import { OtherOrderDetailComponent } from './components/other-order-detail/other-order-detail.component';

@NgModule({
    declarations: [OtherOrdersComponent, OtherOrderDetailComponent],
    imports: [OtherOrdersRoutingModule, SharedModule],
    providers:[OtherOrdesService]
})
export class otherOrdersModule { }