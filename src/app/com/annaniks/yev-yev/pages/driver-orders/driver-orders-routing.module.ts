import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DriverOrdersComponent } from './driver-orders.component';
const routes: Routes = [{ path: '', component: DriverOrdersComponent }];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DriverOrdersRoutingModule { }