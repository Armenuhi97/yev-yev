import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../core/shared/shared.module';
import { StarRouterModule } from './star-router.module';
import { StarServiceService } from './star-service.service';
import { StarComponent } from './star.component';



@NgModule({
  declarations: [StarComponent],
  imports: [
    CommonModule,
    SharedModule,
    StarRouterModule
  ],

})

export class StarModule { }
