import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DriverInfoComponent } from './driver-info.component';


const ratingRoutes: Routes = [{ path: '', component: DriverInfoComponent }];

@NgModule({
  imports: [RouterModule.forChild(ratingRoutes)],
  exports: [RouterModule]
})
export class DriverInfoRoutingModule { }
