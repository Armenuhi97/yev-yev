import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { of, Subject, throwError } from 'rxjs';
import { catchError, map, switchMap, takeUntil } from 'rxjs/operators';
import { ExtraOrders } from '../../../../core/models/extra-orders';
import { Messages } from '../../../../core/models/mesages';
import { SubrouteDetails } from '../../../../core/models/orders-by-hours';
import { User } from '../../../../core/models/salary';
import { ServerResponce } from '../../../../core/models/server-reponce';
import { OtherOrdesService } from '../../other-orders.service';
import { OpenTimesService } from '../../../../core/services/open-times.service'
import * as moment from 'moment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-other-order-detail',
  templateUrl: './other-order-detail.component.html',
  styleUrls: ['./other-order-detail.component.scss'],
  providers: [DatePipe],
})
export class OtherOrderDetailComponent implements OnInit, OnDestroy {
  radioValue = '';
  unsubscribe$ = new Subject();
  validateForm: FormGroup;
  public id: number;
  extraOrder: ExtraOrders;
  allDrivers: User[] = [];
  filteredDrivers: User[] = [];
  subRoutes: SubrouteDetails[] = [];
  public openTimes = [];
  phoneNumberPrefix = new FormControl('+374');

  constructor(
    private _openTimesService: OpenTimesService,
    private _otherOrdersService: OtherOrdesService,
    private _fb: FormBuilder,
    private nzMesageService: NzMessageService,
    private router: Router,
    private _datePipe: DatePipe,
    private activatedRoute: ActivatedRoute) {
    this.openTimes = this._openTimesService.getOpenTimes();
    this._initForm();
    this.getParamsId();

  }

  ngOnInit(): void {
    // this.getSubrouteList();
  }

  getDrivers(mainRoute) {
    return this._otherOrdersService.getDrivers(mainRoute).pipe(
      map((data: ServerResponce<User[]>) => {

        this.allDrivers = data.results;
        this.filterDriver();
      },
        catchError(() => {
          this.allDrivers = [];
          return throwError(false);
        }))
    )
  }
  getSubrouteList() {
    return this._otherOrdersService.getSubRouteList().pipe(
      takeUntil(this.unsubscribe$),
      switchMap((data: ServerResponce<any>) => {
        this.subRoutes = data.results;
        return this.getOtherOrderById();
      }))
  }

  private getOtherOrderById() {
    return this._otherOrdersService.getExtraOrderById(this.id).pipe(switchMap((data) => {
      this.extraOrder = data;
      this.radioValue = data.status;
      const orderDate = this.extraOrder.connected_order_details.date;
      const date = new Date(orderDate);
      if (this.extraOrder && this.extraOrder.connected_order_details.sub_route_details) {
        const subrouteDetail = this.subRoutes.filter((el => el.id === this.extraOrder.connected_order_details.sub_route));
        this.validateForm.patchValue({
          personCount: this.extraOrder.connected_order_details.person_count,
          subroute: (subrouteDetail && subrouteDetail.length) ? subrouteDetail[0] : null,
        });
        return this.getDrivers(this.extraOrder.connected_order_details.sub_route_details.main_route).pipe(map(() => {
          const phoneNumber = this.extraOrder.connected_order_details.phone_number;
          this.validateForm.patchValue({
            startPointAddress: this.extraOrder.connected_order_details.start_address,
            endPointAddress: this.extraOrder.connected_order_details.end_address,
            order_phone_number: phoneNumber ? phoneNumber.slice(4) : null,
            comment: this.extraOrder.connected_order_details.comment,
            date,
            time: this.compareTwoDates(date),
          });
        }));
      } else {
        const phoneNumber = this.extraOrder.connected_order_details.phone_number;
        const subrouteDetail = this.subRoutes.filter((el => el.id === this.extraOrder.connected_order_details.sub_route));

        this.validateForm.patchValue({
          startPointAddress: this.extraOrder.connected_order_details.start_address,
          endPointAddress: this.extraOrder.connected_order_details.end_address,
          order_phone_number: phoneNumber ? phoneNumber.slice(4) : null,
          comment: this.extraOrder.connected_order_details.comment,
          date,
          time: this.compareTwoDates(date),
          personCount: this.extraOrder.connected_order_details.person_count,
          subroute: (subrouteDetail && subrouteDetail.length) ? subrouteDetail[0] : null,
        });
        return of();
      }
    }));
  }
  compareTwoDates(orderDate): string {
    const dateFormat = moment(orderDate).format('HH:mm');
    const date = moment(dateFormat, 'HH:mm');
    // let date = this._datePipe.transform(new Date(item.hour), 'HH:mm');
    for (const time of this.openTimes) {
      const start = moment(time.start, 'HH:mm');
      const end = moment(time.end, 'HH:mm');
      if ((moment(date).isSameOrAfter(start) && moment(date).isBefore(end))) {
        return time.time;
      }
    }
    return;
  }
  private getParamsId(): void {
    this.activatedRoute.params.pipe(takeUntil(this.unsubscribe$),
      switchMap((params) => {
        if (!!params.id) {
          this.id = params.id;
          return this.getSubrouteList();
        } else {
          return of();
        }
      })).subscribe();
  }
  onCancelOrder(): void {
    this._otherOrdersService.cancelExtraOrder(this.id).pipe(takeUntil(this.unsubscribe$),
    ).subscribe(() => {
      this.nzMesageService.success(Messages.success);
      this.router.navigate(['/dashboard/other-orders']);
    });
  }

  private _initForm(): void {
    this.validateForm = this._fb.group({
      startPointAddress: [null],
      endPointAddress: [null],
      order_phone_number: [null],
      personCount: [null, Validators.required],
      subroute: [null, Validators.required],
      comment: [null],
      date: [null],
      time: [null]
    });

    this.validateForm.get('subroute').valueChanges.pipe(takeUntil(this.unsubscribe$),
      switchMap((value: SubrouteDetails) => {
        if (value && value.id) {
          return this.getDrivers(value.main_route);
        } else {
          return of();
        }
      })
    ).subscribe();

    this.validateForm.get('personCount').valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe((value) => {
      if (value) {
        this.filterDriver();
      }
    });
  }
  filterDriver(): void {
    const personCount = this.validateForm.get('personCount').value;
    if (personCount) {
      this.filteredDrivers = this.allDrivers.filter((val) => {
        return (+val.car_capacity >= personCount);
      });

    } else {
      this.filteredDrivers = [];
    }
  }
  onOrderSave(): void {

    if (this.validateForm.invalid) {
      this.nzMesageService.error(Messages.failValidation);
      return;
    }
    if (this.id) {
      const date = this._datePipe.transform(this.validateForm.get('date').value, 'yyy-MM-dd');
      const time = this.validateForm.get('time').value.slice(0, this.validateForm.get('time').value.indexOf('-')).trim();
      const dateTime = `${date} ${time}`;
      const sendResponse = {
        date: dateTime,
        extra_order_id: this.id,
        sub_route_id: this.validateForm.get('subroute').value ? this.validateForm.get('subroute').value.id : null,
        comment: this.validateForm.get('comment').value,
        phone_number: this.validateForm.get('order_phone_number').value ?
          '+374' + this.validateForm.get('order_phone_number').value : null,
        start_address: this.validateForm.get('startPointAddress').value,
        end_address: this.validateForm.get('endPointAddress').value,
        person_count: this.validateForm.get('personCount').value
      };

      this._otherOrdersService.editExtraOrder(sendResponse).pipe(
        takeUntil(this.unsubscribe$),
        map(() => {
          const mainRoute = this.validateForm.get('subroute').value.main_route;
          const params = {
            date: sendResponse.date,
            subRoute: sendResponse.sub_route_id,
            mainRoute
          };
          this.nzMesageService.success(Messages.success);
          this.router.navigate(['/dashboard/main-routes'], { queryParams: params });
        })).subscribe();

    }
  }
  getLabel(subroute: SubrouteDetails): string {
    return `${subroute.start_point_city.name_hy} - ${subroute.end_point_city.name_hy}`;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
