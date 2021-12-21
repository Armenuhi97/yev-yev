import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { ReviewComponent } from './review.component';

const ratingRoutes: Routes = [{ path: '', component: ReviewComponent }];


@NgModule({

  imports: [RouterModule.forChild(ratingRoutes)],
  exports: [RouterModule]
})
export class ReviewRoutingModule { }
