import { DatePipe } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { differenceInCalendarDays } from 'date-fns';
import { Observable, of, Subject } from 'rxjs';
import { distinctUntilChanged, map, switchMap, takeUntil } from 'rxjs/operators';
import { OrderType } from '../../../../core/models/order-type';
import { User } from '../../../../core/models/salary';
import { ServerResponce } from '../../../../core/models/server-reponce';
import { MainRoutesService } from '../../main-routes.service';

@Component({
  selector: 'app-add-client-form',
  templateUrl: './add-client-form.component.html',
  styleUrls: ['./add-client-form.component.scss'],
  providers: [
    DatePipe
  ]
})
export class AddClientFormComponent implements OnInit, OnDestroy {
  openTimes = [];
  today = new Date();
  phoneNumberPrefix = new FormControl('+374');
  isShowError: boolean;
  unsubscribe$ = new Subject<void>();
  keyName: string;
  @Input() subRouteInfo;
  @Input() date: Date;
  @Input() isReturn: boolean;
  @Input() isEditing = false;
  @Input() radioValue: string;
  @Input() orderTypes: OrderType[] = [];
  @Input() validateForm: FormGroup;

  constructor(
    private mainRoutesService: MainRoutesService,
    private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.initForm();
    this.checkForm();
  }

  private initForm(): void {
    this.keyName = this.isReturn ? 'Two' : '';
    this.setInitialValueFormDate();
    this.checkSubrouteAddress();
  }

  setInitialValueFormDate(): void {

    if (this.date && this.isReturn && !this.validateForm.get('date' + this.keyName).value) {
      this.validateForm.patchValue({
        ['date' + this.keyName]: new Date(this.date)
      });
    }
    if (this.isReturn) {
      this.getOpenTimes().pipe(takeUntil(this.unsubscribe$)).subscribe();
    }

  }
  disabledDate = (current: Date): boolean =>
    // Can not select days before today and today
    differenceInCalendarDays(this.today, current) > 0

  // private _handleControlChanges(): void {
  //   this.validateForm.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe((value) => {
  //     this.onChange(value);
  //   });
  // }
  private checkDate(): void {
    this.validateForm.get('date' + this.keyName).valueChanges.pipe(
      distinctUntilChanged(),
      takeUntil(this.unsubscribe$),
      switchMap((el) => {
        if (el) {
          return this.getOpenTimes();
        } else {
          return of();
        }
      })).subscribe();

  }
  public getWeekDays(): string[] {
    return ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  }
  private getOpenTimes(): Observable<void> {
    const date = this.datePipe.transform(this.validateForm.get('date' + this.keyName).value, 'YYYY-MM-dd');
    return this.mainRoutesService.getBlockedHours(this.subRouteInfo.id, date).pipe(map((data: ServerResponce<any>) => {

      const day = this.validateForm.get('date' + this.keyName).value.getDay();
      const index = day ? day - 1 : 6;
      const weekDayKey = this.getWeekDays()[index];

      this.setOpenTimes(this.subRouteInfo.work_times[weekDayKey + '_start'],
        this.subRouteInfo.work_times[weekDayKey + '_end'], data.results);
    }));
  }
  isInteger(event): boolean {
    if (this.validateForm.get('orderType' + this.keyName).value === 0) {
      if (!this.validateForm.get('personCount' + this.keyName).value && event.keyCode === 48) {
        return false;
      }
    }
  }
  setTimeLabel(time): string {
    return this.subRouteInfo.start_point_is_static ? time.start : time.time;
  }
  checkSubrouteAddress(): void {
    if (this.subRouteInfo.start_point_is_static) {
      this.validateForm.patchValue({
        ['startPointAddress' + this.keyName]: this.subRouteInfo.start_point_address_hy
      });
      this.validateForm.get('startPointAddress' + this.keyName).disable();
    }
    if (this.subRouteInfo.end_point_is_static) {
      this.validateForm.patchValue({
        ['endPointAddress' + this.keyName]: this.subRouteInfo.end_point_address_hy
      });
      this.validateForm.get('endPointAddress' + this.keyName).disable();
    }

  }
  private checkOrderType(): void {
    this.validateForm.get('orderType' + this.keyName).valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe((value) => {
      if (value === 1) {
        this.validateForm.get('personCount' + this.keyName).setValue(0);
        this.validateForm.get('personCount' + this.keyName).disable();
      } else {
        this.validateForm.get('personCount' + this.keyName).enable();
        if (value === 2 && ((this.validateForm.get('personCount' + this.keyName).value < 4 ||
          this.validateForm.get('personCount' + this.keyName).value > 8) || !this.validateForm.get('personCount' + this.keyName).value)) {
          this.validateForm.get('personCount' + this.keyName).reset();
        }
      }
    });
  }
  private checkPhoneNumber(): void {
    this.validateForm.get('phone_number' + this.keyName).valueChanges.pipe(takeUntil(this.unsubscribe$),
      switchMap((value) => {
        if (value && !this.isEditing) {
          if (value.toString().length === 8) {
            this.validateForm.patchValue({
              ['order_phone_number' + this.keyName]: value
            });
            return this.mainRoutesService.getUserByPhonenumber('+374' + value).pipe(map(((data: ServerResponce<User[]>) => {
              const result = data.results;
              if (result && result.length) {
                this.isShowError = false;
                const item = result[0];
                this.validateForm.patchValue({
                  ['userId' + this.keyName]: item.id,
                  ['first_name' + this.keyName]: item.user.first_name,
                  ['last_name' + this.keyName]: item.user.last_name,
                  ['userComment' + this.keyName]: item.comment
                })
                this.validateForm.get('first_name' + this.keyName).disable();
                this.validateForm.get('last_name' + this.keyName).disable();
              } else {
                this.validateForm.get('userId' + this.keyName).reset();
                this.validateForm.get('first_name' + this.keyName).reset();
                this.validateForm.get('last_name' + this.keyName).reset();
                this.validateForm.get('first_name' + this.keyName).enable();
                this.validateForm.get('last_name' + this.keyName).enable();
                this.isShowError = true;
              }
            })));
          } else {
            return of(false);
          }
        } else {
          return of();
        }
      })).subscribe();
  }
  private checkForm(): void {
    this.checkOrderType();
    this.checkPhoneNumber();
    this.checkDate();
  }
  getHour(time: string): number | null {
    if (time) {
      const hourLastIndex = time.indexOf(':');
      const hour = time.substr(0, hourLastIndex);
      return +hour;
    } else {
      return null;
    }
  }
  private setOpenTimes(start, end, blockedHours) {

    const startHour = this.getHour(start);
    // let startMin = this.getMin(start);
    const endHour = this.getHour(end);
    // let endMin = end;
    const arr = [];
    if (startHour && endHour) {
      for (let i = startHour; i <= endHour; i++) {
        const startTime = `${i <= 9 ? `0${i}` : i}:00`;
        const endTime = `${i <= 9 ? `0${i}` : i}:30`;
        const isBlocked = blockedHours.some((date) => {
          return this.datePipe.transform(new Date(date.time), 'HH:mm') === startTime;
        });
        if (!isBlocked) {
          arr.push({
            start: startTime, end: endTime,
            time: `${startTime} - ${endTime}`, isActive: false, closeId: 0, isDisabled: false, isBlocked: true, blockId: 0,
            orderStatus: null, isHasTwoStatus: false
          });
        }
        if (i !== endHour) {
          const startTime1 = `${i <= 9 ? `0${i}` : i}:30`;
          const endTime1 = `${i + 1 <= 9 ? `0${i + 1}` : i + 1}:00`;
          const isBlocked2 = blockedHours.some((date) => this.datePipe.transform(new Date(date.time), 'HH:mm') === startTime1);
          if (!isBlocked2) {
            arr.push({
              start: startTime1, end: endTime1, time: `${startTime1} - ${endTime1}`,
              isActive: false, closeId: 0, isDisabled: false, isBlocked: true, blockId: 0,
              orderStatus: null, isHasTwoStatus: false
            });
          }
        }
      }
    }
    this.openTimes = arr;
    let isExist = false;
    if (this.validateForm.get('time' + this.keyName).value) {
      isExist = this.openTimes.some((el) => el.time === this.validateForm.get('time' + this.keyName).value);
    }
    if (this.openTimes.length && (!this.validateForm.get('time' + this.keyName).value || !isExist)) {
      this.validateForm.get('time' + this.keyName).setValue(this.openTimes[0].time);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
