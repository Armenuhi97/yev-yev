import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SalariesComponent } from "./salaries.component";
const salaryRoutes: Routes = [{ path: '', component: SalariesComponent }]
@NgModule({
    imports: [RouterModule.forChild(salaryRoutes)],
    exports: [RouterModule]
})
export class SalariesRoutingModule { }