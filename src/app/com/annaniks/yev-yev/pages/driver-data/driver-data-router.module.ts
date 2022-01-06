import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DriverDataComponent } from './driver-data.component';


const ratingRoutes: Routes = [{ path: '', component: DriverDataComponent }];

@NgModule({
  imports: [RouterModule.forChild(ratingRoutes)],
  exports: [RouterModule]
})
export class DriverDataRouterModule { }
