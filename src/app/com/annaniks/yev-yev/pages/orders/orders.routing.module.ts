import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { OrdersComponent } from "./orders.component";
const orders: Routes = [{ path: '', component: OrdersComponent }]
@NgModule({
    imports: [RouterModule.forChild(orders)],
    exports: [RouterModule]
})
export class OrdersRoutingModule { }