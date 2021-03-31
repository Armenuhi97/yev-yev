import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { OtherOrdersComponent } from "./other-orders.component";
const routes: Routes = [{ path: '', component: OtherOrdersComponent }]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OtherOrdersRoutingModule { }