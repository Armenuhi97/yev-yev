import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { RouteItem } from '../../core/models/routes.model';
import { MainService } from '../main/main.service';
import { differenceInCalendarDays } from 'date-fns';
import { map, takeUntil } from 'rxjs/operators';
import { ServerResponce } from '../../core/models/server-reponce';
import { AddressService } from './address.service';
import { AddressFilterModel, AddressModel } from './model/address.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
  providers: [DatePipe]
})
export class AddressComponent implements OnInit, OnDestroy {
  public total = 10;
  public pageSize = 10;
  public pageIndex = 1;
  public limit = 10;
  public offset = 0;
  public today = new Date();
  unsubscribe$ = new Subject();
  filterForm: FormGroup;
  mainRoutes: RouteItem[] = [];
  orders: AddressModel[] = [];
  isGet = false;
  constructor(
    private addressService: AddressService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private mainService: MainService) {
    this.initFilterForm();
  }

  ngOnInit(): void {
    this.getOrders();
  }
  getNextPage($event: number) {
    this.pageIndex = $event;
    this.searchOrderByAddress();
  }
  private initFilterForm(): void {
    this.filterForm = this.fb.group({
      startDate: [new Date(), [Validators.required]],
      endDate: [new Date(), [Validators.required]],
      mainRoute: [null],
      address: [null, [Validators.required]],
    });
  }
  disabledDate = (current: Date): boolean =>
    differenceInCalendarDays(current, this.today) > 0

  getOrders(): void {
    this.mainService.getAllRoutes(1).pipe(
      takeUntil(this.unsubscribe$),
      map((data: ServerResponce<RouteItem[]>) => {
        this.mainRoutes = data.results;
        if (this.mainRoutes && this.mainRoutes.length) {
          this.filterForm.get('mainRoute').setValue(this.mainRoutes[0].id)
        }
      })
    ).subscribe();
  }
  submitForm(): void {
    this.isGet = false;
    if (this.filterForm.valid) {
      this.searchOrderByAddress();
    }
  }

  private searchOrderByAddress(): void {
    const formValue = this.filterForm.value;
    const params: AddressFilterModel = {
      start_date: this.datePipe.transform(formValue.startDate, 'YYYY-MM-dd') + ' 00:00',
      end_date: this.datePipe.transform(formValue.endDate, 'YYYY-MM-dd') + ' 23:59',
      address: formValue.address,
      route_id: formValue.mainRoute,
      limit: this.limit,
      offset: (this.pageIndex - 1) * 10,
      page: this.pageIndex
    };
    this.addressService.searchAddress(params).pipe(takeUntil(this.unsubscribe$)).subscribe((data: ServerResponce<AddressModel[]>) => {
      this.total = data.count;
      this.orders = data.results;
      this.isGet = true;
    });
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
