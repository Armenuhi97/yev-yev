import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { AddressService } from '../../address.service';
import { AddressModel } from '../../model/address.model';

@Component({
  selector: 'app-address-list',
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.scss']
})
export class AddressListComponent {
  @Input() total: number;
  @Input() orders: AddressModel[] = [];
  @Output() getNextPage = new EventEmitter<number>();
  @Input() pageIndex = 1;
  pageSize = 10;
  unsubscribe$ = new Subject();
  userId: number;
  index = 0;

  constructor() { }

  nzPageIndexChange(evt): void {
    this.pageIndex = evt;
    this.getNextPage.emit(evt);
  }
}
