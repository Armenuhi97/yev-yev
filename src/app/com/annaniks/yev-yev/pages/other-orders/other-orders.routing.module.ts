import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { OtherOrderDetailComponent } from "./components/other-order-detail/other-order-detail.component";
import { OtherOrdersComponent } from "./other-orders.component";
const routes: Routes = [
    { path: '', component: OtherOrdersComponent },
    { path: ':id', component: OtherOrderDetailComponent }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OtherOrdersRoutingModule { }