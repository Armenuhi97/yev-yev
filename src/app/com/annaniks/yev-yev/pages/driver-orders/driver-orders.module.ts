import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriverOrdersComponent } from './driver-orders.component';
import { SharedModule } from '../../core/shared/shared.module';
import { DriverOrdersRoutingModule } from './driver-orders-routing.module';



@NgModule({
  declarations: [DriverOrdersComponent],
  imports: [
    CommonModule,
    DriverOrdersRoutingModule,
    SharedModule
  ]
})
export class DriverOrdersModule { }
