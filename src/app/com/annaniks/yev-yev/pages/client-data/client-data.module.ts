import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientDataComponent } from './client-data.component';
import { ClientDataRoutingModule } from './client-data-routing.module';
import { SharedModule } from '../../core/shared/shared.module';
import { UsersModule } from '../users/users.module';




@NgModule({
  declarations: [ClientDataComponent],
  imports: [
    CommonModule,
    ClientDataRoutingModule,
    SharedModule,
    UsersModule
  ]
})
export class ClientDataModule { }
