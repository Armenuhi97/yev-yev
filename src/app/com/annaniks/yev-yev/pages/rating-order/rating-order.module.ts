import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingOrderComponent } from './rating-order.component';
import { SharedModule } from '../../core/shared/shared.module';
import { RatingOrderRoutingModule } from './rating-order-routing.module';



@NgModule({
  declarations: [RatingOrderComponent],
  imports: [
    CommonModule,
    SharedModule,
    RatingOrderRoutingModule
  ]
})
export class RatingOrderModule { }
