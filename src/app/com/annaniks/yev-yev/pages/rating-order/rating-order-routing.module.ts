import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RatingOrderComponent } from './rating-order.component';

const ratingRoutes: Routes = [{ path: '', component: RatingOrderComponent }];

@NgModule({
  imports: [RouterModule.forChild(ratingRoutes)],
  exports: [RouterModule]
})
export class RatingOrderRoutingModule { }
