import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriverOrdersComponent } from './driver-orders.component';
import { SharedModule } from '../../core/shared/shared.module';
import { DriverOrdersRoutingModule } from './driver-orders-routing.module';
import { ChangeCommentComponent } from './components/change-comment/change-comment.component';
import { DriverOrdersService } from './driver-orders.service';



@NgModule({
  declarations: [DriverOrdersComponent, ChangeCommentComponent],
  imports: [
    CommonModule,
    DriverOrdersRoutingModule,
    SharedModule
  ],
  providers: [DriverOrdersService]
})
export class DriverOrdersModule { }
