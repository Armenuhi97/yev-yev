import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../core/shared/shared.module';
import { DriverInfoComponent } from './driver-info.component';
import { ColorPickerModule } from 'ngx-color-picker';
import {  DriverRoutesComponent } from '../driver-routes/driver-routes.component'


@NgModule({
  declarations: [DriverInfoComponent],
  imports: [
    CommonModule,
    SharedModule,
    ColorPickerModule,
  ],

})
export class DriverInfoModule { }
