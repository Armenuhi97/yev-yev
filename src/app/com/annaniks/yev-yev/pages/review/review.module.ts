import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "../../core/shared/shared.module";
import { ReviewRoutingModule } from './review-routing.module';
import {ReviewService } from './review.service';
import {ReviewComponent } from './review.component';



@NgModule({
  declarations: [ReviewComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReviewRoutingModule
  ],
  providers: [ReviewService ]
})
export class ReviewngModule { }
