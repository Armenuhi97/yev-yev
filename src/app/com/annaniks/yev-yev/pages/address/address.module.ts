import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressComponent } from './address.component';
import { AddressRoutingModule } from './address-routing.module';
import { SharedModule } from '../../core/shared/shared.module';
import { AddressService } from './address.service';
import { AddressListComponent } from './components/address-list/address-list.component';

@NgModule({
  declarations: [AddressComponent, AddressListComponent],
  imports: [
    CommonModule,
    AddressRoutingModule,
    SharedModule
  ],
  providers: [AddressService]
})
export class AddressModule { }
