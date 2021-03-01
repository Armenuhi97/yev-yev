import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MainRoutesComponent } from './main-routes.component';
const mainRouteRoutes: Routes = [{ path: '', component: MainRoutesComponent }]
@NgModule({
    imports: [RouterModule.forChild(mainRouteRoutes)],
    exports: [RouterModule]
})
export class MainRoutesRoutingModule { }