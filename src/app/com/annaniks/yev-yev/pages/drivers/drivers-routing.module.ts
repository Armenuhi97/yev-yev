import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DriversComponent } from "./drivers.component";
const driversRoutes: Routes = [{ path: '', component: DriversComponent }]
@NgModule({
    imports: [RouterModule.forChild(driversRoutes)],
    exports: [RouterModule]
})
export class DriversRoutingModule { }