import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { forkJoin, Observable, of, Subject, throwError } from 'rxjs';
import { catchError, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Messages } from '../../core/models/mesages';
import { OrderType } from '../../core/models/order-type';
import { OrdersByHours } from '../../core/models/orders-by-hours';
import { RouteItem } from '../../core/models/routes.model';
import { User } from '../../core/models/salary';
import { ServerResponce } from '../../core/models/server-reponce';
import { AppService } from '../../core/services/app.service';
import { OpenTimesService } from '../../core/services/open-times.service';
import { OrderTypeService } from '../../core/services/order-type';
import { MainRoutesService } from './main-routes.service';

import { differenceInCalendarDays } from 'date-fns';
import { NotificationService } from '../../core/services/notification.service';
import { Notification } from '../../core/models/notification';
import { AddPassangerDto } from '../../../../../com/annaniks/yev-yev/core/models/dto/routes.dto.model'
import { createForm } from './helpers/create-form';
import { animate, style, transition, trigger } from '@angular/animations';
import { AvailableDriversDto } from './dto/driver.dto';
import { AvailableDriverModel } from './models/available-driver';
import * as moment from 'moment';
import { ChangeStatusDto } from './dto/change-status.dto';
import { SettingsService } from '../settings/setting.service';

@Component({
  selector: 'app-main-routes',
  templateUrl: 'main-routes.component.html',
  styleUrls: ['main-routes.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(+100%)' }),
        animate('300ms ease-in', style({ transform: 'translateX(0%)' }))
      ])
    ])
  ],
  providers: [DatePipe]
})
export class MainRoutesComponent {
  subroutDate!: string;
  lastDate = new Date();
  errorMessage: string;
  activeIndex: number;
  private notifications: Notification[] = [];
  public searchControl = new FormControl(null);
  driverSubroutes;
  public modalTitle: string;
  doneRoutes = [];
  pageSize = 10;
  selectIndex: number;
  isGetItem = false;
  userInfo: OrdersByHours[] = [];
  fullUserInfo: OrdersByHours[] = [];
  currentDriver: AvailableDriverModel[] = [];
  fullCurrentDriver: AvailableDriverModel[] = [];

  isVisibleOrderInfo = false;
  isOrderEditing = false;
  backSubrouteInfo;
  orderMembers = [];
  editOrderIndex: number;
  approvedOrders = [];
  public subRouteInfos = [];
  selectedTime;
  public driver: User;
  isVisible = false;
  unsubscribe$ = new Subject();
  validateForm: FormGroup | null;
  phoneNumberPrefix = new FormControl('+374');
  userId: number;
  currentInterval;
  isShowError = false;
  isOpenInfo = false;
  radioValue = 'approved,canceled';
  isEditing: boolean;
  editIndex;
  selectedDate = new FormControl(new Date());
  subRouteInfo: any;
  public mainRoutes: RouteItem[] = [];
  isOpenCalendar = false;
  countsList = [];
  currentId: number;
  drivers: User[];
  timeItem;
  windowHeight: number;
  selectInfo;
  private _param
  private _lastMainRouteId: number;
  orderTypes: OrderType[] = [];
  keyName = 'Two';
  // openTimes = []
  isGetFunction = true;
  isGet = true;
  isShowDriverRoutes = false;
  totalDoneRoutes = 0;
  doneRoutesPageIndex = 1;
  index = 0;
  getOtherRouteOrdersCount: boolean;
  driverControl = new FormControl('', Validators.required);
  public comeBackSwitch: boolean = false;
  public comeBackIsAble = false;
  isUpdateBack: string;
  selectedPrice: number = null;

  constructor(
    private _mainRoutesService: MainRoutesService,
    private router: Router, private _datePipe: DatePipe,
    private _fb: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _mainRouteService: MainRoutesService,
    private _appService: AppService,
    private _router: Router,
    private nzMessages: NzMessageService,
    private _orderTypeService: OrderTypeService,
    private _openTimesService: OpenTimesService,
    private settingsService: SettingsService,
    private notificationService: NotificationService) {
    // this.openTimes = this._openTimesService.getOpenTimes()
    this.orderTypes = this._orderTypeService.getOrderTypes();
  }

  ngOnInit() {
    this.combine();
    this._initForm();
    let date = this._datePipe.transform(this.selectedDate.value, 'yyyy-MM-dd');
    this.getNotifications();
    // this._mainRouteService.getHourlyOrdersByDate()
    // .subscribe((res:any)=>{

    // })
    // this.comeBackSwitchClick()
  }
  private getNotifications() {
    this.notificationService.getNotificationState().pipe(takeUntil(this.unsubscribe$)).subscribe((notifications: Notification[]) => {
      this.notifications = notifications;
      if (this.subRouteInfos?.length && this.notifications?.length) {
        for (const route of this.subRouteInfos) {
          this.setTodayRoutes(route);
        }
      }
    });
  }
  search() {
    let value = this.searchControl.value ? this.searchControl.value.trim() : null
    this.userInfo = this.fullUserInfo.filter((data) => { return data.phone_number.includes(value) == true })
  }
  handleCancelDoneOrders() {
    this.doneRoutes = []
    this.isShowDriverRoutes = false;
    this.doneRoutesPageIndex = 1;
  }
  closeRouteModal() {
    this.isOpenInfo = false;
    this.userInfo = [];
    this.approvedOrders = []
  }
  showDriverRoutesModal(item) {
    this.isShowDriverRoutes = true;
    this.driverSubroutes = item;
    this._getDoneRoutes();
  }
  nzDoneOrderPageIndexChange($event) {
    this.doneRoutesPageIndex = $event;
    this._getDoneRoutes();
  }
  private _getDoneRoutes() {
    // let date = this._datePipe.transform(this.selectedDate.value, 'yyyy-MM-dd');
    // let offset = (this.doneRoutesPageIndex - 1) * 10;
    this._mainRouteService.getDoneRoutes(this.driverSubroutes.id).pipe(takeUntil(this.unsubscribe$)).subscribe((data: any[]) => {

      // this.totalDoneRoutes = data.count
      this.doneRoutes = data;
      // this.doneRoutes.sort((a: any, b: any) =>
      //     new Date(a.date).getTime() - new Date(b.date).getTime()
      // );
    })
  }

  private _checkQueryParams() {
    return this._activatedRoute.queryParams.pipe(takeUntil(this.unsubscribe$), switchMap((param) => {
      if (this.isGet) {
        this.isGet = true
        if (param.date && (!this._param || (this._param && (this._param.date !== param.date || this._param.subRoute !== param.subRoute || this._param.mainRoute !== param.mainRoute)))) {
          this._param = param;
          this.userInfo = [];
          this.isOpenInfo = false;
          let item = this.mainRoutes.filter((val) => { return val.id == +param.mainRoute });
          if (item && item[0]) {
            let index = this.mainRoutes.indexOf(item[0]);
            this.selectIndex = index;
          }

          this.selectedDate.setValue(new Date(param.date));
          this.lastDate = new Date(param.date);
          this.currentId = +param.mainRoute;
          this.isGetFunction = false;
          let time = this._datePipe.transform(param.date, 'HH:mm');
          return this.combineObservable(param.subRoute, time).pipe(
            map(() => {
              this.radioValue = param.status ? param.status : 'approved,canceled';
              if (this.radioValue == 'pending')
                this.changeStatus(this.radioValue)
              this.isGet = false;
              this._param = {}
              this._router.navigate([], { queryParams: {} });

            })
          )
        } else {
          if (!this._param || (this._param && +this._param.mainRoute !== +this.currentId) || (+this._lastMainRouteId !== +this.currentId)) {
            this._lastMainRouteId = this.currentId;
            return this.combineObservable()
          } else {
            return of()
          }
        }
      } else {
        this.isGet = true
        return of()
      }
    }))

  }
  public send(data) {
    this._mainRouteService.sendMessage(data.id).pipe(takeUntil(this.unsubscribe$)).subscribe((result: { ok: boolean }) => {
      if (result.ok) {
        this.nzMessages.success(Messages.success);
        data.viber_message_sended = true
      } else {
        this.nzMessages.error(Messages.fail);
      }
    },
      () => {
        this.nzMessages.error(Messages.fail);

      })
  }
  public isCanceledByClient(data) {
    const item = data.approved_order_orders.filter((el) => el.order.canceled_by_client == true)
    return (item && item.length) ? true : false
  }
  getOrderType(type: number): string {
    return this._appService.checkPropertyValue(this._appService.checkPropertyValue(
      this.orderTypes.filter((val) => +val.id === +type), 0), 'name_en');
  }

  private _initForm(): void {
    this.validateForm = this._fb.group({
      firstForm: createForm(this._fb),
      secondForm: createForm(this._fb, this.keyName)
    });

  }
  combine() {
    const combine = forkJoin(
      this.getAllRoutes(),
    )
    combine.pipe(takeUntil(this.unsubscribe$)).subscribe()
  }
  getAllRoutes() {
    return this._mainRoutesService.getAllRoutes(1).pipe(map((data: ServerResponce<RouteItem[]>) => {
      this.mainRoutes = data.results
    }))
  }
  public getWeekDays() {
    return ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  }
  getRouteInfo(id, subrouteId?, time?) {
    return this._mainRoutesService.getSubRoute(id).pipe(
      map((data: ServerResponce<any>) => {
        if (subrouteId && time) {
          data.results = data.results.map((data) => {
            let selectTime;
            if (+data.id === +subrouteId) {
              selectTime = time;
            }
            return Object.assign(data, { selectTime });
          });
        }
        this.subRouteInfos = data.results;
        this.getWorkTimes();
        this.isGetItem = true;
      }));
  }
  getWorkTimes() {
    let date = this.selectedDate.value;
    if (date) {
      let day = date.getDay();
      let index = day ? day - 1 : 6
      let weekDayKey = this.getWeekDays()[index];
      for (const route of this.subRouteInfos) {
        this._createTimesArray(route.work_times[weekDayKey + '_start'], route.work_times[weekDayKey + '_end'], route);
        if (this.notifications?.length) {
          this.setTodayRoutes(route);
        }
      }
    }
  }
  getHour(time: string) {
    if (time) {
      let hourLastIndex = time.indexOf(':')
      let hour = time.substr(0, hourLastIndex);
      return +hour
    } else {
      return null
    }

  }
  // getMin(time: string) {
  //     if (time) {
  //         let hourLastIndex = time.indexOf(':')
  //         let minutesIndex = time.indexOf(':', hourLastIndex)
  //         let minutes = time.substr(hourLastIndex + 1, minutesIndex);
  //         return +minutes
  //     } else {
  //         return null
  //     }

  // }
  private _createTimesArray(start, end, subroute) {
    let startHour = this.getHour(start);
    // let startMin = this.getMin(start);
    let endHour = this.getHour(end)
    // let endMin = end;
    let arr = [];
    if (startHour && endHour) {
      for (let i = startHour; i <= endHour; i++) {
        let startTime = `${i <= 9 ? `0${i}` : i}:00`;
        let endTime = `${i <= 9 ? `0${i}` : i}:30`;
        arr.push({
          start: startTime, end: endTime, time: `${startTime} - ${endTime}`, isActive: false, closeId: 0, isDisabled: false, isBlocked: true, blockId: 0,
          orderStatus: null, isHasTwoStatus: false
        })

        if (i !== endHour) {
          let startTime = `${i <= 9 ? `0${i}` : i}:30`;
          let endTime = `${i + 1 <= 9 ? `0${i + 1}` : i + 1}:00`;
          arr.push({
            start: startTime, end: endTime, time: `${startTime} - ${endTime}`, isActive: false, closeId: 0, isDisabled: false, isBlocked: true, blockId: 0,
            orderStatus: null, isHasTwoStatus: false
          })
        }
      }
    }

    subroute.openTimes = arr;

  }
  private setTodayRoutes(route) {
    const selectDate = this._datePipe.transform(this.selectedDate.value, 'YYYY-MM-dd');
    const today = this._datePipe.transform(new Date(), 'YYYY-MM-dd');
    if (selectDate === today) {
      route.openTimes = route.openTimes.map((time) => {
        return Object.assign({}, time, { orderStatus: null, isHasTwoStatus: false });
      });
      for (const notification of this.notifications) {
        if (notification.order_details.sub_route_details.main_route === route.main_route &&
          notification.order_details.sub_route_details.id === route.id) {
          route.openTimes = route.openTimes.map((time) => {
            const date = this._datePipe.transform(new Date(notification.order_details.date), 'HH:mm');
            if (time.start === date) {
              let isHasTwoStatus = false;
              let status = notification.order_details.status;
              if (time.orderStatus && time.orderStatus.indexOf(status) === -1) {
                status = time.orderStatus + `, ${status}`;
                isHasTwoStatus = true;
              }
              const changedObject = Object.assign({}, time, { orderStatus: status, isHasTwoStatus });
              return changedObject;
            }
            return time;
          });
        }
      }
    }
  }

  finishOrder(data) {
    if (data.status === 'done') {
      return;
    }
    this._mainRouteService.finishOrder(data.id).pipe(takeUntil(this.unsubscribe$),
      switchMap(() => {
        data.status = 'done';
        return this.getDrivers()
      })).subscribe(() => {
        this.nzMessages.success(Messages.success);
      },
        () => {
          this.nzMessages.error(Messages.fail);

        })

  }

  getLabelOfDrivers(dr: User) {
    return `${dr.user.first_name} ${dr.user.last_name} (${dr.car_model}) (${dr.car_capacity}) [${dr.main_city.name_hy}]`
  }
  onChangeTab($event) {
    this.userInfo = [];
    this.isOpenInfo = false;
    this.selectIndex = $event;
    this.subRouteInfos = [];
    this.currentId = this.mainRoutes[this.selectIndex].id;
    if (this.isGetFunction) {
      this._checkQueryParams().pipe(takeUntil(this.unsubscribe$)).subscribe()
    } else {
      this.isGetFunction = true;
    }
    this.selectedDate.setValue(this.lastDate);

  }
  combineObservable(subrouteId?: number, time?: string) {
    const combine = forkJoin(
      this.getRouteInfo(this.currentId, subrouteId, time),
      this.getDrivers()
    )
    return combine
  }
  getDrivers() {
    return this._mainRoutesService.getDrivers(this.currentId, true).pipe(
      map((data: ServerResponce<User[]>) => {
        this.drivers = data.results;
      },
        catchError(() => {
          this.drivers = []
          return throwError(false)
        }))
    )
  }
  changeStatus($event) {
    this.getInfo(this.selectedTime, $event, false).subscribe();
  }
  public getApprovedOrders() {
    return this._mainRouteService.getAllAprovedOrders(this.subRouteInfo.id, this._formatDate(this.selectedTime)).pipe(
      map((orders: ServerResponce<any>) => {
        this.approvedOrders = orders.results;
      })
    )
  }
  private _formatDate(time, selectDate = this.selectedDate.value) {

    let date = this._datePipe.transform(selectDate, 'yyyy-MM-dd');
    let currenTime = this.getTime(time);
    let current = `${date} ${currenTime}`;
    return current
  }
  private getTime(time) {
    return time.slice(0, time.indexOf(' '))
  }
  // checkSubrouteAddress(bool: boolean) {
  //   let startKey: string;
  //   let endKey: string;
  //   let subrouteInfo;
  //   let group: string;
  //   if (!bool) {
  //     group = 'firstForm';
  //     startKey = 'startPointAddress';
  //     endKey = 'endPointAddress';
  //     subrouteInfo = this.subRouteInfos[this.activeIndex];
  //   } else {
  //     group = 'secondForm';
  //     startKey = 'startPointAddressTwo';
  //     endKey = 'endPointAddressTwo';
  //     const index = this.activeIndex === 0 ? 1 : 0;
  //     subrouteInfo = this.subRouteInfos[index];
  //   }
  //   if (subrouteInfo.start_point_is_static) {
  //     this.validateForm.get(group).get(startKey).setValue(subrouteInfo.start_point_address_hy);
  //     this.validateForm.get(group).get(startKey).disable();
  //   }
  //   if (subrouteInfo.end_point_is_static) {
  //     this.validateForm.get(group).get(endKey).setValue(subrouteInfo.end_point_address_hy);
  //     this.validateForm.get(group).get(endKey).disable();
  //   }

  // }
  public showModal(): void {

    this.isVisible = true;
    this.validateForm.get('firstForm').get('orderType').setValue(0);
    this.validateForm.get('secondForm').get('orderType' + this.keyName).setValue(0);

    // this.checkSubrouteAddress(bool);
  }

  public checkAddress(moderator) {
    if (moderator.order && moderator.order.is_extra_order) {
      return `${moderator.order.start_address} -> ${moderator.order.end_address}`
    }
    if (this.subRouteInfo.start_point_is_static) {
      return moderator.end_address ? moderator.end_address : 'Հասցե չկա'
    } else {
      if (this.subRouteInfo.end_point_is_static) {
        return moderator.start_address ? moderator.start_address : 'Հասցե չկա'
      } else {
        return (moderator.start_address || moderator.end_address) ? `${moderator.start_address} - ${moderator.end_address}` : 'Հասցե չկա'
      }
    }
  }

  public openOrderModal() {
    this.isVisibleOrderInfo = true;
  }
  handleCancel(): void {
    // this.isVisible = false;
    // this.validateForm.reset();
    // this.validateForm.enable();
    // this.errorMessage = '';
    // this.isShowError = false;
    // this.isEditing = false;
    // this.editIndex = null;
    // this.isOrderEditing = false;
    // this.orderStatus = ''
    // this.editOrderIndex = null;
    // this.isVisibleOrderInfo = false;
    // this.orderMembers = [];
    this.closeModal();
    this.comeBackSwitch = false;
    this.comeBackIsAble = false;

    // this._setNull(this.validateForm)
    // this._setNull(this.validateFormTwo)
  }
  onOrderSave() {
    if (this.timeItem && !this.timeItem.isDisabled) {
      let item = this.orderMembers.filter((data) => { return (data.isSelect == true) })

      let orderIds = item.map((data) => {
        return { id: data.order.id }
      });
      // if (orderIds && orderIds.length) {
      let sendObject = {
        "sub_route": this.subRouteInfo.id,
        "date": this._formatDate(this.selectedTime),
        "driver": this.approvedOrders[this.editOrderIndex].driver,
        "order": orderIds
      }
      this._mainRouteService.editApprovedOrder(this.approvedOrders[this.editOrderIndex].id, sendObject).pipe(takeUntil(this.unsubscribe$),
        map(() => {
          this.closeModal()
          this.getInfo(this.selectedTime).subscribe();
          this.nzMessages.success(Messages.success)

        })).subscribe()
      // }
    }
  }

  cancelCancelation(moderator) {
    this._mainRouteService.cancelCancelation(moderator.order.id).pipe(takeUntil(this.unsubscribe$),
      map(() => {
        this.nzMessages.success(Messages.success);
        moderator.order.canceled_by_client = false;
      })).subscribe();
  }
  approveCancelation(id: number, index) {

    this._mainRouteService.approveCancelation(id)
      .pipe(takeUntil(this.unsubscribe$),
        map(() => {
          // this.closeModal();
          this.orderMembers.splice(index, 1);
          this.nzMessages.success(Messages.success)

          this.getInfo(this.selectedTime).subscribe();
        })).subscribe()
  }
  nzPageIndexChange(page: number) { }

  public addOrderByDriver() {
    if (this.driver) {
      let orders = this.userInfo.filter((data) => { return (data.isSelect == true && data.is_in_approved_orders == false) })

      let ordersIds = orders.map((data) => { return { id: data.id } })

      let sendObject = {
        "sub_route": this.subRouteInfo.id,
        "date": this._formatDate(this.selectedTime),
        "driver": this.driver,
        "order": ordersIds
      }
      this._mainRouteService.addApprovedOrder(sendObject).pipe(takeUntil(this.unsubscribe$),
        map(() => {
          this.driver = null
          this.getInfo(this.selectedTime).subscribe()

        })).subscribe()
    }
  }
  public onDeleteApprovedOrder(index) {
    this._mainRouteService.deleteApprovedOrder(this.approvedOrders[index].id).pipe(takeUntil((this.unsubscribe$)),
      map(() => {

        this.getInfo(this.selectedTime).subscribe()
      })).subscribe()
  }

  public checkIsNull(value) {
    return value ? value : false;
  }
  isClick = false;
  public onclientSave() {
    if (this.isClick) {
      return;
    }
    this.errorMessage = ''
    let backSubroute;
    this.isClick = true;
    if (this.isEditing) {
      const formValue = this.validateForm.get('firstForm').value;
      const date = this._formatDate(formValue.time, formValue.date);
      const editResponse = {
        comment: formValue.comment,
        sub_route: this.subRouteInfo.id,
        date,
        person_count: formValue.personCount,
        start_address: formValue.startPointAddress,
        start_langitude: '',
        start_latitude: '',
        end_address: formValue.endPointAddress,
        end_langitude: '',
        end_latitude: '',
        is_free: this.checkIsNull(formValue.isFree),
        is_extra_order: this.checkIsNull(formValue.isExtra),
        user: formValue.userId ? formValue.userId : null,
        order_phone_number: formValue.order_phone_number ? '+374' + formValue.order_phone_number : null,
        order_type: formValue.orderType,
        is_admin: true,
        change_status: formValue.isChangeStatus ? formValue.isChangeStatus : false
        // this._appService.checkPropertyValue(this.validateForm.get('isChangeStatus'), 'value', false)
      };
      this.sendEditRequest(this.userInfo[this.editIndex].id, editResponse);

    } else {
      if (this.validateForm.get('firstForm').invalid) {
        this.errorMessage = Messages.failValidation;
        // this.nzMessages.error(Messages.failValidation);
        this.isClick = false;
        return;
      }
      const date = this._formatDate(this.selectedTime);
      const firstFormValue = (this.validateForm.get('firstForm') as FormGroup).controls;

      const sendObject = new AddPassangerDto('', firstFormValue, this.subRouteInfo.id, date, this.selectedPrice);

      const requests = [this.sendRequest(sendObject)];
      if (this.comeBackIsAble) {
        if (this.validateForm.get('secondForm').invalid) {
          this.errorMessage = 'Հետադարձի ' + Messages.failValidation;
          this.isClick = false;
          // this.nzMessages.error('Հետադարձի ' + Messages.failValidation);
          return;
        }
        const secondFormValue = (this.validateForm.get('secondForm') as FormGroup).controls;

        const returnDate = this._formatDate(secondFormValue['time' + this.keyName].value, secondFormValue['date' + this.keyName].value);

        backSubroute = this.subRouteInfos.find((el) => {
          return el.id !== this.subRouteInfo.id;
        });
        const sendObjectTwo = new AddPassangerDto(this.keyName, secondFormValue, backSubroute.id, returnDate, this.selectedPrice);
        requests.push(this.sendRequest(sendObjectTwo));
      }

      forkJoin(requests).pipe(
        takeUntil(this.unsubscribe$),
        finalize(() => this.isClick = false)
      ).subscribe({
        next: () => {
          this.nzMessages.success(Messages.success);
          this.getInfo(this.selectedTime).subscribe();
          if (this.comeBackIsAble && !!backSubroute) {
            const time = this.validateForm.get('secondForm').get('time' + this.keyName).value;
            const formatSelectedDate = this._datePipe.transform(new Date(this.selectedDate.value), 'YYYY-MM-dd');
            const formatReturnedDate = this._datePipe.transform(this.validateForm.get('secondForm').get('date' + this.keyName).value, 'YYYY-MM-dd');
            if (formatSelectedDate === formatReturnedDate) {
              this.isUpdateBack = time;
            }
          }
          this.closeModal();
          this.comeBackIsAble = false;
          this.comeBackSwitch = false;

        },
        error: () => {
          this.nzMessages.error(Messages.fail);
        }
      });
    }

  }
  sendRequest(sendObject, backSubrout?: boolean) {
    return this._mainRouteService.addOrder(sendObject)
  }
  onSubmitOrder(moderator) {
    const date = this._formatDate(this.selectedTime, this.selectedDate.value);
    const changeStatusDto = new ChangeStatusDto(moderator, this.subRouteInfo.id, date);
    this.sendEditRequest(moderator.id, changeStatusDto, false);
  }
  getPricesByRoute(startTime, dayIndex) {
    return this.settingsService.getRoutePrices(this.subRouteInfo.id).pipe(tap((data) => {
      if (dayIndex in data) {
        const value = data[dayIndex];
        this.selectedPrice = value.find((el) => el.time === startTime)?.price;
      }
    }))
  }
  getInfo(time, status = this.radioValue, isChange = true) {
    if (time) {
      this.isOpenInfo = true;
      const current = this._formatDate(time);
      return this._mainRouteService.getOrdersByHour(this.subRouteInfo.id, current, status)
        .pipe(takeUntil(this.unsubscribe$),
          switchMap((data: OrdersByHours[]) => {
            data = data.map((val) => {
              const isSelect = val.is_in_approved_orders ? true : false;
              return Object.assign({}, val, {
                // cancelled_at: val.cancelled_at ? new Date(val.cancelled_at) : null,
                is_in_approved_orders: val.is_in_approved_orders, isSelect, isDisabled: false
              });
            });
            this.fullUserInfo = data;
            this.userInfo = data;
            if (isChange) {
              this.isGetItem = true;
            }
            return this.getApprovedOrders();
          }));
    } else {
      return of();
    }
  }

  resetItem($event): void {
    this.isGetItem = $event;
  }
  resetItem2($event): void {
    this.isUpdateBack = $event;
  }
  formatItem(value) {
    return new Observable(value);
  }
  sendEditRequest(id, sendObject, isChangeFromModal = true) {
    this._mainRouteService.changeOrder(id, sendObject).pipe(takeUntil(this.unsubscribe$),
      finalize(() => this.isClick = false)
    ).subscribe(() => {
      this.nzMessages.success(Messages.success);
      if (isChangeFromModal)
        this.closeModal();
      if (isChangeFromModal && this.radioValue === 'pending' && this.validateForm.get('firstForm').get('isChangeStatus').value) {
        this._mainRouteService.changeOrderStatus(id).subscribe(() => {
          this.getInfo(this.selectedTime).subscribe();
        })
      } else {
        this.getInfo(this.selectedTime).subscribe();
      }
    },
      () => {
        this.nzMessages.error(Messages.fail);
      });

  }
  closeModal(): void {
    this.isVisible = false;
    this.validateForm.reset();
    this.validateForm.enable();
    this.isShowError = false;
    this.isEditing = false;
    this.editIndex = null;
    this.isOrderEditing = false;
    this.orderStatus = '';
    this.editOrderIndex = null;
    this.isVisibleOrderInfo = false;
    this.orderMembers = [];
    this.errorMessage = '';
  }
  public formatDate(date: string) {
    if (date) {
      let formatDate = this._datePipe.transform(new Date(date), 'YYYY-MM-dd HH:mm');
      return formatDate
    }
    return
  }
  addSelectedOrder(index) {
    let item = this.userInfo.filter((data) => { return (data.is_in_approved_orders == false && data.isSelect == true) });
    let orderIds = item.map((data) => {
      return { id: data.id }
    });
    let selectedOrders = this.approvedOrders[index].approved_order_orders.map((val) => {
      return { id: val.order.id };
    })
    let mergeArray = [...orderIds, ...selectedOrders];
    if (orderIds && orderIds.length) {
      const sendObject = {
        sub_route: this.subRouteInfo.id,
        date: this._formatDate(this.selectedTime),
        driver: this.approvedOrders[index].driver,
        order: mergeArray
      }
      this._mainRouteService.editApprovedOrder(this.approvedOrders[index].id, sendObject).pipe(takeUntil(this.unsubscribe$),
        map(() => {
          this.getInfo(this.selectedTime).subscribe();
          this.nzMessages.success(Messages.success)

        })).subscribe();
    }
  }
  onDeleteOrder(index: number): void {

    if (this.userInfo[index].id) {
      this._mainRouteService
        .deleteOrders(this.userInfo[index].id)
        .pipe(
          takeUntil(this.unsubscribe$),
        )
        .subscribe(() => {
          this.getInfo(this.selectedTime).subscribe()
          this.nzMessages.success(Messages.success)
        },
          () => {
            this.nzMessages.error(Messages.fail)
          });
    }

  }
  get tableTitle() {
    if (this.subRouteInfo && this.subRouteInfo.start_point_city) {
      return `${this.subRouteInfo.start_point_city.name_hy} - ${this.subRouteInfo?.end_point_city.name_hy}`
    } else {
      return
    }
  }
  get userCounts() {
    let item = this.userInfo.filter((data) => {
      return (data.is_in_approved_orders == false && data.isSelect == true)
    })

    let calculateCount = 0;
    item.forEach((data) => {
      calculateCount += data.person_count;
    });
    if (this.drivers) {
      if (calculateCount) {
        this.currentDriver = this.fullCurrentDriver.filter((val) => {
          return (+val.car_capacity >= calculateCount
            // && val.user.is_active === true
            // && +val.located_city.id === +this.subRouteInfo.start_point_city.id
          );
        });
        // const arr1 = arr.filter((el) => el.located_city.id !== el.main_city.id);
        // const arr2 = arr.filter((el) => el.located_city.id === el.main_city.id);
        // this.currentDriver = [...arr1, ...arr2];
      } else {
        // const arr = this.drivers.filter((val) => {
        //   return (val.user.is_active === true && +val.located_city.id === +this.subRouteInfo.start_point_city.id);
        // });

        // const arr1 = arr.filter((el) => el.located_city.id !== el.main_city.id);
        // const arr2 = arr.filter((el) => el.located_city.id === el.main_city.id);
        this.currentDriver = this.fullCurrentDriver;
      }
    }
    return calculateCount;
  }
  public onEditOrder(index, moderator) {

    this.showModal()
    this.isEditing = true;
    this.editIndex = index;
    let info = this.userInfo[this.editIndex];

    this.validateForm.get('firstForm').get('first_name').disable();
    this.validateForm.get('firstForm').get('last_name').disable();
    this.validateForm.get('firstForm').get('userComment').disable();
    this.validateForm.get('firstForm').get('phone_number').disable();

    this.validateForm.get('firstForm').patchValue({
      startPointAddress: info.start_address,
      endPointAddress: info.end_address,
      order_phone_number: info.phone_number ? info.phone_number.substr(4) : '',
      first_name: info.client_details.user.first_name,
      last_name: info.client_details.user.last_name,
      userComment: info.client_details.comment,
      phone_number: info.client_details.phone_number ? info.client_details.phone_number.substr(4) : '',
      orderType: info.order_type,
      personCount: info.person_count,
      comment: info.comment,
      date: this.selectedDate.value,
      time: this.selectedTime,
      isFree: info.is_free,
      isExtra: info.is_extra_order,
      userId: info.user
    });
    if (moderator.is_in_approved_orders || this.timeItem.isDisabled
    ) {
      this.validateForm.get('firstForm').disable();
    }
  }
  selectCheckbox($event, index) {
    let type = this.userInfo[index].order_type;
    let id = this.userInfo[index].id;
    for (let item of this.userInfo) {
      if (type == 2) {
        if ((item.order_type == 0 || item.order_type == 2) && (+id !== +item.id)) {
          // item.isSelect = false;
          item.isDisabled = $event ? true : false
        }
      } else {
        if (type == 0) {
          if ((item.order_type == 2) && item.id !== id) {
            // item.isSelect = false;
            item.isDisabled = $event ? true : false

          }
        }
      }
    }
  }

  today = new Date();

  disabledDate = (current: Date): boolean =>
    // Can not select days before today and today
    differenceInCalendarDays(this.today, current) > 0;

  public orderStatus: string;
  public onEditOrderMembers(index, status: string) {
    this.orderStatus = status;
    this.isOrderEditing = true;
    this.editOrderIndex = index;
    this.orderMembers = this.approvedOrders[this.editOrderIndex].approved_order_orders;

    this.orderMembers = this.orderMembers.map((val) => { return Object.assign({}, val, { isSelect: true }) });
    this.openOrderModal()

  }
  modalDrivers = [];
  isVisibleDriverModal: boolean = false;
  selectOrderId;
  changeDriverName(data) {
    this.selectOrderId = data.id
    this.isVisibleDriverModal = true;
    let arr = this.drivers.filter((val) => {
      return (+val.car_capacity >= data.seat_count && val.user.is_active == true && +val.located_city.id == +this.subRouteInfo.start_point_city.id)
    })

    // let arr = this.drivers.filter((val) => {
    //     return (val.user.is_active == true && +val.located_city.id == +this.subRouteInfo.start_point_city.id)
    // })
    let arr1 = arr.filter((el) => { return el.located_city.id !== el.main_city.id });
    let arr2 = arr.filter((el) => { return el.located_city.id == el.main_city.id })
    this.modalDrivers = [...arr1, ...arr2];

    this.driverControl.setValue(data.driver);
  }
  handleCancelDriver() {
    this.isVisibleDriverModal = false;
    this.modalDrivers = [];
    this.driverControl.reset();
    this.selectOrderId = null;
  }

  onSaveDriver() {
    if (this.driverControl.value)
      this._mainRouteService.changeApprovedOrderGroup(this.selectOrderId, this.driverControl.value).pipe(takeUntil(this.unsubscribe$),
        switchMap(() => {
          this.handleCancelDriver()
          return this.getInfo(this.selectedTime)
        })).subscribe()
  }
  public checkAddress2(moderator) {
    if (moderator.order && moderator.order.is_extra_order) {
      return `${moderator.order.start_address} -> ${moderator.order.end_address}`
    }
    if (this.subRouteInfo.start_point_is_static) {
      return moderator.order && moderator.order.end_address ? moderator.order.end_address : 'Հասցե չկա'
    } else {
      if (this.subRouteInfo.end_point_is_static) {
        return moderator.order && moderator.order.start_address ? moderator.order.start_address : 'Հասցե չկա'
      } else {
        return (moderator.order && (moderator.order.start_address || moderator.order.end_address)) ? `${moderator.order.start_address} - ${moderator.order.end_address}` : 'Հասցե չկա'
      }
    }
  }
  removeAndCancelOrder(moderator, ind: number) {
    // this.orderMembers.splice(ind, 1)
    this._mainRouteService.removeAndCancelOrder(moderator.order.approved_order_details[0].approved_order.id,
      moderator.order.id).pipe(takeUntil(this.unsubscribe$),
        switchMap(() => {
          this.orderMembers.splice(ind, 1);
          return this.getInfo(this.selectedTime);
        })).subscribe();
  }
  private getAvailableDrivers(): Observable<void> {
    const sendObject: AvailableDriversDto = {
      sub_route_id: this.subRouteInfo.id,
      main_route_id: this.currentId,
      date: this._datePipe.transform(this.selectedDate.value, 'YYYY-MM-dd')
    };
    return this._mainRoutesService.getAvailableDrivers(sendObject).pipe(
      map((data: AvailableDriverModel[]) => {
        this.currentDriver = data;
        this.fullCurrentDriver = data;
      })
    );
  }
  getInformation($event, index: number) {
    if ($event) {
      this.timeItem = $event.timeItem;
      this.selectedTime = $event.time;
      this.subRouteInfo = this.subRouteInfos[index];
      this.backSubrouteInfo = this.subRouteInfos[index === 0 ? 1 : 0];
      this.activeIndex = index;
      this.subroutDate = $event.date;
      let time = this.subRouteInfo.start_point_is_static ? this.timeItem.start : this.selectedTime;
      this.modalTitle = `${this.subRouteInfo.start_point_city.name_hy} - ${this.subRouteInfo.end_point_city.name_hy} ${this._datePipe.transform(this.selectedDate.value, 'dd-MM-yyyy')} ${this.getDay()} ${time}`
      this.radioValue = 'approved,canceled';
      let isUnChange = $event.isUnChange ? false : true;
      // const selectedTime=this.getTime()
      const startTime = this.timeItem.start;
      const dayIndex = this.selectedDate.value.getDay();
      forkJoin([
        this.getInfo($event.time, this.radioValue, isUnChange),
        this.getAvailableDrivers(),
        this.getPricesByRoute(startTime, dayIndex)
      ])
        .pipe(takeUntil(this.unsubscribe$)).subscribe()
    } else {
      this.modalTitle = ''
    }
  }
  setTimeLabel(time): string {
    return this.subRouteInfo.start_point_is_static ? time.start : time.time
  }
  openCalendar($event?): void {
    this.isOpenCalendar = true;
    if ($event) {
      const date = moment($event).format('YYYY-MM-DD');
      const controlValue = moment(this.lastDate).format('YYYY-MM-DD');
      if (date === controlValue) {
        return;
      }
      this.lastDate = this.selectedDate.value;
      this.radioValue = 'approved,canceled';
      this.userInfo = [];
      this.fullUserInfo = []
      this.isOpenInfo = false;
      this.isGetItem = true
      this.subRouteInfos = this.subRouteInfos.map((el) => {
        return Object.assign({}, el, { selectTime: null })
      })
      this.getWorkTimes();
      this.closeCalendar();
    }
  }

  closeCalendar() {
    this.isOpenCalendar = false;
  }

  changeDate(type: number) {
    let date = new Date(this.selectedDate.value)
    date.setDate(date.getDate() + type);
    this.selectedDate.setValue(new Date(date));
    this.lastDate = new Date(date);
    this.isGetItem = true;
    this.radioValue = 'approved,canceled';
    this.subRouteInfos = this.subRouteInfos.map((el) => {
      return Object.assign({}, el, { selectTime: null })
    })
    this.getWorkTimes()
  }
  getDay(): string {
    if (this.selectedDate && this.selectedDate.value) {
      const dayIndex = this.selectedDate.value.getDay();
      switch (dayIndex) {
        case (0): { return 'Կիրակի'; }
        case (1): { return 'Երկուշաբթի'; }
        case (2): { return 'Երեքշաբթի'; }
        case (3): { return 'Չորեքշաբթի'; }
        case (4): { return 'Հինգշաբթի'; }
        case (5): { return 'Ուրբաթ'; }
        case (6): { return 'Շաբաթ'; }
      }
    }
  }
  getApprovedId(index: number) {
    this.index = this.approvedOrders[index].id;
    this.router.navigate([`/dashboard/raiting-order/${this.index}`]);
  }

  public onClickComeBackIsAble() {
    this.comeBackIsAble = !this.comeBackIsAble;
  }
  changeComeBack(evt: boolean): void {
    if (!evt) {
      this.comeBackIsAble = evt;
      this.comeBackSwitch = false;
      this.errorMessage = '';
    }

  }
  public comeBackSwitchClick() {
    let subroutWay = this.activeIndex === 0 ? [1, 0] : [0, 1];
    let subroute;
    if (this.comeBackSwitch) {
      subroute = this.subRouteInfos[subroutWay[0]];
      this.setPhoneNumberValue();
    }
    else {
      subroute = this.subRouteInfos[subroutWay[1]];
    }
  }


  private setPhoneNumberValue(): void {
    const formValue = (this.validateForm.get('firstForm') as FormGroup).getRawValue();
    if (!this.validateForm.get('secondForm').get('phone_number' + this.keyName).value
      && !this.validateForm.get('secondForm').get('order_phone_number' + this.keyName).value
    ) {
      this.validateForm.get('secondForm').patchValue({
        ['first_name' + this.keyName]: formValue.first_name,
        ['last_name' + this.keyName]: formValue.last_name,
        ['phone_number' + this.keyName]: formValue.phone_number,
        ['order_phone_number' + this.keyName]: formValue.order_phone_number,
        ['userId' + this.keyName]: formValue.userId
      });

      if (formValue.first_name && formValue.last_name) {
        this.validateForm.get('secondForm').get('first_name' + this.keyName).disable();
        this.validateForm.get('secondForm').get('last_name' + this.keyName).disable();
      }
    }
  }

  // private setDisableEnableAddress(startControl: string, endControl: string, subRoute, formGroupName: string): void {
  //   if (subRoute.start_point_is_static) {
  //     this[formGroupName].get(startControl).disable();
  //   } else {
  //     this[formGroupName].get(startControl).enable()
  //   }
  //   if (subRoute.end_point_is_static) {
  //     this[formGroupName].get(endControl).disable()

  //   } else {
  //     this[formGroupName].get(endControl).enable()
  //   }
  // }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
