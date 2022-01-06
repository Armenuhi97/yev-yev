import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../core/shared/shared.module';
import { DriverDataRouterModule } from './driver-data-router.module';
import { DriverDataComponent } from './driver-data.component';
import { DriverModule } from '../drivers/drivers.module';



@NgModule({
  declarations: [DriverDataComponent],
  imports: [
    CommonModule,
    SharedModule,
    DriverDataRouterModule,
    DriverModule
  ]
})
export class DriverDataModule { }
