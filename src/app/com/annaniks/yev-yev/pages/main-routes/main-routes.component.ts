import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { forkJoin, Observable, of, Subject, throwError } from 'rxjs';
import { catchError, map, switchMap, takeUntil } from 'rxjs/operators';
import { Messages } from '../../core/models/mesages';
import { OrderResponse } from '../../core/models/order';
import { OrderType } from '../../core/models/order-type';
import { OrdersByHours } from '../../core/models/orders-by-hours';
import { RouteItem } from '../../core/models/routes.model';
import { User } from '../../core/models/salary';
import { ServerResponce } from '../../core/models/server-reponce';
import { AppService } from '../../core/services/app.service';
import { OpenTimesService } from '../../core/services/open-times.service';
import { OrderTypeService } from '../../core/services/order-type';
import { MainRoutesService } from './main-routes.service';

import { differenceInCalendarDays, setHours } from 'date-fns';
import { NotificationService } from '../../core/services/notification.service';
import { Notification } from '../../core/models/notification';
import { AddPassangerDto } from '../../../../../com/annaniks/yev-yev/core/models/dto/routes.dto.model'
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-main-routes',
  templateUrl: 'main-routes.component.html',
  styleUrls: ['main-routes.component.scss'],
  providers: [DatePipe]
})
export class MainRoutesComponent {
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
  currentDriver = [];
  isVisibleOrderInfo = false;
  isOrderEditing = false;
  orderMembers = [];
  editOrderIndex: number;
  approvedOrders = [];
  public subRouteInfos = [];
  selectedTime;
  public driver: User;
  isVisible = false;
  unsubscribe$ = new Subject();
  validateForm: FormGroup;
  validateFormTwo: FormGroup;
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
  // openTimes = []
  isGetFunction = true;
  isGet = true;
  isShowDriverRoutes = false;
  totalDoneRoutes = 0;
  doneRoutesPageIndex = 1;
  index = 0;
  driverControl = new FormControl('', Validators.required);
  public comeBackSwitch: boolean = false
  public formClass = 'switchOff'
  public bodyClass = 'switchOffBody'
  // public comeBackSwitch = new Subject()
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
    private notificationService: NotificationService) {
    // this.openTimes = this._openTimesService.getOpenTimes()
    this.orderTypes = this._orderTypeService.getOrderTypes();
    this._secondFormInit()
  }

  ngOnInit() {
    this.combine();
    this._initForm();
    let date = this._datePipe.transform(this.selectedDate.value, 'yyyy-MM-dd');
    this.getNotifications();

    console.log('rote', this.mainRoutes)

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
  isInteger(event) {
    if (this.validateForm.get('orderType').value == 0) {
      if (!this.validateForm.get('personCount').value && event.keyCode == 48) {
        return false
      }
    }
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

          this.selectedDate.setValue(new Date(param.date))
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
    let item = data.approved_order_orders.filter((el) => { return el.order.canceled_by_client == true })
    return (item && item.length) ? true : false
  }
  getOrderType(type: number): string {
    return this._appService.checkPropertyValue(this._appService.checkPropertyValue(this.orderTypes.filter((val) => { return +val.id == +type }), 0), 'name_en')
  }
  private _initForm() {
    this.validateForm = this._fb.group({
      first_name: [null],
      last_name: [null],
      phone_number: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      userComment: [null],
      startPointAddress: [null],
      endPointAddress: [null],
      startPointAddressTwo: [null],
      endPointAddressTwo: [null],
      order_phone_number: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      orderType: [0, Validators.required],
      personCount: [null, Validators.required],
      comment: [null],
      date: [null],
      time: [null],
      isChangeStatus: [false],
      isFree: [false],
      isExtra: [false]
    })

    this.validateForm.get('orderType').valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe((value) => {

      if (value == 1) {
        this.validateForm.get('personCount').setValue(0);
        this.validateForm.get('personCount').disable()
      } else {
        this.validateForm.get('personCount').enable();
        if (value == 2 && ((this.validateForm.get('personCount').value < 4 || this.validateForm.get('personCount').value > 8) || !this.validateForm.get('personCount').value)) {
          this.validateForm.get('personCount').reset();
        }
      }
    })
    this.validateForm.get('phone_number').valueChanges.pipe(takeUntil(this.unsubscribe$),
      switchMap((value) => {
        if (value && !this.isEditing) {
          if (value.toString().length == 8) {
            this.validateForm.patchValue({
              order_phone_number: value
            })
            return this._mainRouteService.getUserByPhonenumber('+374' + value).pipe(map(((data: ServerResponce<User[]>) => {
              let result = data.results
              if (result && result.length) {
                this.isShowError = false
                let item = result[0];
                this.userId = item.id
                this.validateForm.patchValue({
                  first_name: item.user.first_name,
                  last_name: item.user.last_name,
                  userComment: item.comment

                })
                this.validateForm.get('first_name').disable()
                this.validateForm.get('last_name').disable()
              } else {
                this.userId = null
                this.validateForm.get('first_name').reset()
                this.validateForm.get('last_name').reset()
                this.validateForm.get('first_name').enable()
                this.validateForm.get('last_name').enable()
                this.isShowError = true
              }
            })))
          } else {
            return of(false)
          }
        } else {
          return of()
        }
      })).subscribe()
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
      console.log('rote', this.mainRoutes)
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
            if (+data.id == +subrouteId) {
              selectTime = time;
            }
            return Object.assign(data, { selectTime: selectTime });
          });
        }
        this.subRouteInfos = data.results;
        console.log(this.subRouteInfos)
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
  }
  combineObservable(subrouteId?: number, time?: string) {
    const combine = forkJoin(
      this.getRouteInfo(this.currentId, subrouteId, time),
      this.getDrivers()
    )
    return combine
  }
  getDrivers() {
    return this._mainRoutesService.getDrivers(this.currentId).pipe(
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
    let currenTime = time.slice(0, time.indexOf(' '))
    let current = `${date} ${currenTime}`;
    return current
  }
  checkSubrouteAddress(bool: boolean) {
    let startKey: string;
    let endKey: string;
    let subrouteInfo;
    if (!bool) {
      startKey = 'startPointAddress';
      endKey = 'endPointAddress';
      subrouteInfo = this.subRouteInfos[this.activeIndex];
    } else {
      startKey = 'startPointAddressTwo';
      endKey = 'endPointAddressTwo';
      // startKey = 'startPointAddress';
      // endKey = 'endPointAddress';
      const index = this.activeIndex === 0 ? 1 : 0;
      subrouteInfo = this.subRouteInfos[index];
    }
    // = bool ? this.subRouteInfos[1] :
    // if (bool) {
    console.log(subrouteInfo);

    if (subrouteInfo.start_point_is_static) {
      // console.log(subrouteInfo.start_point_is_static, subrouteInfo.start_point_address_hy, startKey);

      this.validateForm.get(startKey).setValue(subrouteInfo.start_point_address_hy);
      this.validateForm.get(startKey).disable();


    }
    if (subrouteInfo.end_point_is_static) {
      this.validateForm.get(endKey).setValue(subrouteInfo.end_point_address_hy);
      this.validateForm.get(endKey).disable()
    }
    console.log(this.validateForm);
    console.log(this.validateForm.get(startKey).value)

  }
  public showModal(bool: boolean = false): void {

    this.isVisible = true;
    this.validateForm.get('orderType').setValue(0);
    // this.validateForm.get('personCount').setValue(1);
    this.checkSubrouteAddress(bool);
    // }
    // else if (bool !== false) {
    //   if (this.subRouteInfo.end_point_is_static) {
    //     this.validateForm.get('startPointAddress').setValue(this.subRouteInfo.start_point_address_hy);
    //     this.validateForm.get('startPointAddress').disable()
    //   }
    //   if (this.subRouteInfo.start_point_is_static) {
    //     this.validateForm.get('endPointAddress').setValue(this.subRouteInfo.end_point_address_hy);
    //     this.validateForm.get('endPointAddress').disable()
    //   }

    // }
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
    this.isVisible = false;
    this.validateForm.reset();
    this.validateForm.enable();
    this.userId = null
    this.isShowError = false;
    this.isEditing = false;
    this.editIndex = null;
    this.isOrderEditing = false;
    this.orderStatus = ''
    this.editOrderIndex = null;
    this.isVisibleOrderInfo = false;
    this.orderMembers = []

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
    return value ? value : false
  }
  public onclientSave() {
    if (this.isEditing) {
      let date = this._formatDate(this.validateForm.get('time').value, this.validateForm.get('date').value)
      let editResponse = {
        comment: this.validateForm.get('comment').value,
        sub_route: this.subRouteInfo.id,
        date: date,
        person_count: this.validateForm.get('personCount').value,
        start_address: this.validateForm.get('startPointAddress').value,
        start_langitude: '',
        start_latitude: '',
        end_address: this.validateForm.get('endPointAddress').value,
        end_langitude: '',
        end_latitude: '',
        is_free: this.checkIsNull(this.validateForm.get('isFree').value),
        is_extra_order: this.checkIsNull(this.validateForm.get('isExtra').value),
        user: this.userId ? this.userId : null,
        order_phone_number: this.validateForm.get('order_phone_number').value ? '+374' + this.validateForm.get('order_phone_number').value : null,
        order_type: this.validateForm.get('orderType').value,
        is_admin: true,
        change_status: this._appService.checkPropertyValue(this.validateForm.get('isChangeStatus'), 'value', false)
      }
      this.sendEditRequest(this.userInfo[this.editIndex].id, editResponse);

    } else {
      this.comeBackSwitchClick()
      if (this.validateForm.invalid) {
        this.nzMessages.error(Messages.fail);
        return;
      }
      let date = this._formatDate(this.selectedTime)

      let formValue
      let isFirst = true
      if (this.comeBackSwitch) {
        isFirst = false
        formValue = this.validateFormTwo.getRawValue()
      }
      else {
        isFirst = true
        formValue = this.validateForm.getRawValue()
      }

      let userId = this.userId ? this.userId : null
      console.log(formValue);

      const sendObject = new AddPassangerDto(isFirst, formValue, this.subRouteInfo.id, date, userId)
      console.log(sendObject);

      // let sendObject: OrderResponse = {
      // "first_name": this._appService.checkPropertyValue(this.validateForm.get('first_name'), 'value', ""),
      //   "last_name": this._appService.checkPropertyValue(this.validateForm.get('last_name'), 'value', ""),
      //   "user_comment": this.validateForm.get('userComment').value,
      //   "is_free": this.checkIsNull(this.validateForm.get('isFree').value),
      //   "is_extra_order": this.checkIsNull(this.validateForm.get('isExtra').value),
      //   "phone_number": '+374' + this.validateForm.get('phone_number').value,
      //   "comment": this.validateForm.get('comment').value,
      //   "sub_route": this.subRouteInfo.id,
      //   "date": date,
      //   "person_count": this.validateForm.get('personCount').value,
      //   "start_address": this.validateForm.get('startPointAddress').value,
      //   "start_langitude": '',
      //   "start_latitude": '',
      // "end_address": this.validateForm.get('endPointAddress').value,
      //   "end_langitude": '',
      //   "end_latitude": '',
      //   "user": this.userId ? this.userId : null,
      //   "order_phone_number": this.validateForm.get('order_phone_number').value ? '+374' + this.validateForm.get('order_phone_number').value : null,
      //   "order_type": this.validateForm.get('orderType').value,
      //   "status": this.radioValue
      // }
      this.sendRequest(sendObject);
    }
  }
  sendRequest(sendObject) {
    this._mainRouteService.addOrder(sendObject)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        this.nzMessages.success(Messages.success);
        this.closeModal();
        this.getInfo(this.selectedTime).subscribe();
      },
        () => {
          this.nzMessages.error(Messages.fail)
        })

  }

  subroutDate!: string;
  // getSubroueteInfo(event: string) {
  //     this.subroutDate = event;

  // }

  getInfo(time, status = this.radioValue, isChange = true) {

    if (time) {
      this.isOpenInfo = true;
      let current = this._formatDate(time);



      return this._mainRouteService.getOrdersByHour(this.subRouteInfo.id, current, status)
        .pipe(takeUntil(this.unsubscribe$),
          switchMap((data: OrdersByHours[]) => {
            data = data.map((val) => {
              let isSelect = val.is_in_approved_orders ? true : false
              return Object.assign({}, val, { is_in_approved_orders: val.is_in_approved_orders, isSelect: isSelect, isDisabled: false })
            });
            this.fullUserInfo = data;
            this.userInfo = data;
            if (isChange) {
              this.isGetItem = true;
            }
            return this.getApprovedOrders()
          }))
    } else {
      return of()
    }
  }

  resetItem($event) {
    this.isGetItem = $event
  }
  formatItem(value) {
    return new Observable(value)
  }
  sendEditRequest(id, sendObject) {
    this._mainRouteService.changeOrder(id, sendObject).pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.nzMessages.success(Messages.success)
      this.closeModal();
      if (this.radioValue == 'pending' && this.validateForm.get('isChangeStatus').value) {
        this._mainRouteService.changeOrderStatus(id).subscribe(() => {
          this.getInfo(this.selectedTime).subscribe()
        })
      } else {
        this.getInfo(this.selectedTime).subscribe()
      }
    },
      () => {
        this.nzMessages.error(Messages.fail)
      })

  }
  closeModal(): void {
    this.isVisible = false;
    this.validateForm.reset();
    this.validateForm.enable();
    this.userId = null;
    this.isShowError = false;
    this.isEditing = false;
    this.editIndex = null;
    this.isOrderEditing = false;
    this.orderStatus = ''
    this.editOrderIndex = null;
    this.isVisibleOrderInfo = false;
    this.orderMembers = []

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
      return { id: val.order.id }
    })
    let mergeArray = [...orderIds, ...selectedOrders];
    if (orderIds && orderIds.length) {
      let sendObject = {
        "sub_route": this.subRouteInfo.id,
        "date": this._formatDate(this.selectedTime),
        "driver": this.approvedOrders[index].driver,
        "order": mergeArray
      }
      this._mainRouteService.editApprovedOrder(this.approvedOrders[index].id, sendObject).pipe(takeUntil(this.unsubscribe$),
        map(() => {
          this.getInfo(this.selectedTime).subscribe();
          this.nzMessages.success(Messages.success)

        })).subscribe()
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
        const arr = this.drivers.filter((val) => {
          return (+val.car_capacity >= calculateCount && val.user.is_active === true
            && +val.located_city.id === +this.subRouteInfo.start_point_city.id);
        });
        const arr1 = arr.filter((el) => el.located_city.id !== el.main_city.id);
        const arr2 = arr.filter((el) => el.located_city.id === el.main_city.id);
        this.currentDriver = [...arr1, ...arr2];
      } else {
        const arr = this.drivers.filter((val) => {
          return (val.user.is_active === true && +val.located_city.id === +this.subRouteInfo.start_point_city.id);
        });

        const arr1 = arr.filter((el) => el.located_city.id !== el.main_city.id);
        const arr2 = arr.filter((el) => el.located_city.id === el.main_city.id);
        this.currentDriver = [...arr1, ...arr2];
      }
    }



    return calculateCount
  }
  public onEditOrder(index, moderator) {

    this.showModal()
    this.isEditing = true;
    this.editIndex = index;
    let info = this.userInfo[this.editIndex]

    this.validateForm.get('first_name').disable()
    this.validateForm.get('last_name').disable();
    this.validateForm.get('userComment').disable();
    this.validateForm.get('phone_number').disable();

    this.validateForm.patchValue({
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
      isExtra: info.is_extra_order
    })

    this.userId = info.user;
    if (moderator.is_in_approved_orders || this.timeItem.isDisabled
    ) {
      this.validateForm.disable()
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
    this.modalDrivers = [...arr1, ...arr2]

    this.driverControl.setValue(data.driver)
  }
  handleCancelDriver() {
    this.isVisibleDriverModal = false;
    this.modalDrivers = [];
    this.driverControl.reset();
    this.selectOrderId = null
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
    this._mainRouteService.removeAndCancelOrder(moderator.order.approved_order_details[0].approved_order.id, moderator.order.id).pipe(takeUntil(this.unsubscribe$),
      switchMap(() => {
        this.orderMembers.splice(ind, 1)
        return this.getInfo(this.selectedTime)
      })).subscribe()
  }
  getInformation($event, index: number) {
    if ($event) {
      this.timeItem = $event.timeItem
      this.selectedTime = $event.time;
      this.subRouteInfo = this.subRouteInfos[index];
      this.activeIndex = index;
      this.subroutDate = $event.date;
      let time = this.subRouteInfo.start_point_is_static ? this.timeItem.start : this.selectedTime;
      this.modalTitle = `${this.subRouteInfo.start_point_city.name_hy} - ${this.subRouteInfo.end_point_city.name_hy} ${this._datePipe.transform(this.selectedDate.value, 'dd-MM-yyyy')} ${this.getDay()} ${time}`
      this.radioValue = 'approved,canceled';
      let isUnChange = $event.isUnChange ? false : true;


      this.getInfo($event.time, this.radioValue, isUnChange)
        .pipe(takeUntil(this.unsubscribe$)).subscribe()
    } else {
      this.modalTitle = ''
    }
  }
  setTimeLabel(time): string {
    return this.subRouteInfo.start_point_is_static ? time.start : time.time
  }
  openCalendar($event?) {
    this.isOpenCalendar = true;
    if ($event) {
      this.radioValue = 'approved,canceled';
      this.userInfo = [];
      this.fullUserInfo = []
      this.isOpenInfo = false;
      this.isGetItem = true
      this.subRouteInfos = this.subRouteInfos.map((el) => {
        return Object.assign({}, el, { selectTime: null })
      })
      this.getWorkTimes()
    }
  }

  closeCalendar() {
    this.isOpenCalendar = false;
  }

  changeDate(type: number) {
    let date = new Date(this.selectedDate.value)
    date.setDate(date.getDate() + type);
    this.selectedDate.setValue(new Date(date));
    this.isGetItem = true;
    this.radioValue = 'approved,canceled';
    this.subRouteInfos = this.subRouteInfos.map((el) => {
      return Object.assign({}, el, { selectTime: null })
    })
    this.getWorkTimes()
  }
  getDay(): string {
    if (this.selectedDate && this.selectedDate.value) {
      let dayIndex = this.selectedDate.value.getDay()
      switch (dayIndex) {
        case (0): { return 'Կիրակի' }
        case (1): { return 'Երկուշաբթի' }
        case (2): { return 'Երեքշաբթի' }
        case (3): { return 'Չորեքշաբթի' }
        case (4): { return 'Հինգշաբթի' }
        case (5): { return 'Ուրբաթ' }
        case (6): { return 'Շաբաթ' }
      }
    }
  }
  getApprovedId(index: number) {
    this.index = this.approvedOrders[index].id;
    this.router.navigate([`/dashboard/raiting-order/${this.index}`]);
  }

  private _secondFormInit() {
    this.validateFormTwo = this._fb.group({
      first_nameTwo: [null],
      last_nameTwo: [null],
      userCommentTwo: [null],
      phone_numberTwo: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      startPointAddressTwo: [null],
      endPointAddressTwo: [null],
      order_phone_numberTwo: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      orderTypeTwo: [0, Validators.required],
      personCountTwo: [null, Validators.required],
      commentTwo: [null],
      dateTwo: [null],
      timeTwo: [null],
      isChangeStatusTwo: [false],
      isFreeTwo: [false],
      isExtraTwo: [false]
    })
  }

  public comeBackSwitchClick() {
    // const index = this.activeIndex
    let subroutWay = this.activeIndex === 0 ? [1,0] : [0,1]
    let subroute
    if (this.comeBackSwitch) {
      this.formClass = 'switchOn'
      this.bodyClass = 'switchOnBody'
      subroute = this.subRouteInfos[subroutWay[0]]
      this._setSecondForm(subroute)
    }
    else {
      this.formClass = 'switchOff'
      this.bodyClass = 'switchOffBody'
      subroute = this.subRouteInfos[subroutWay[1]]
      this._setFirstForm(subroute)
    }
    this.checkSubrouteAddress(this.comeBackSwitch);

  }

  private _setFirstForm(subRoute: any) {
    const formValue = this.validateFormTwo.value;
    let startAddress = subRoute.start_point_is_static ? subRoute.start_point_address_hy : ''
    let endAddress = subRoute.end_point_is_static ? subRoute.end_point_address_hy : ''
    this.validateForm.patchValue({
      first_name: formValue.first_nameTwo,
      last_name: formValue.last_nameTwo,
      phone_number: formValue.phone_numberTwo,
      userComment: formValue.userCommentTwo,
      startPointAddress: startAddress,
      endPointAddress: endAddress,
      order_phone_number: formValue.order_phone_numberTwo,
      orderType: formValue.orderTypeTwo,
      personCount: formValue.personCountTwo,
      comment: formValue.commentTwo,
      date: formValue.dateTwo,
      time: formValue.timeTwo,
      isChangeStatus: formValue.isChangeStatusTwo,
      isFree: formValue.isFreeTwo,
      isExtra: formValue.isExtraTwo
    })

    this.setDisableEnableAddress('startPointAddress', 'endPointAddress', subRoute, 'validateForm')

    console.log('validateFormTwo', this.validateFormTwo.value);
  }

  private _setSecondForm(subRoute: any) {
    const formValue = this.validateForm.value
    let startAddress = subRoute.start_point_is_static ? subRoute.start_point_address_hy : ''
    let endAddress = subRoute.end_point_is_static ? subRoute.end_point_address_hy : ''
    this.validateFormTwo.patchValue({
      first_nameTwo: formValue.first_name,
      last_nameTwo: formValue.last_name,
      phone_numberTwo: formValue.phone_number,
      userCommentTwo: formValue.userComment,
      startPointAddressTwo: startAddress,
      endPointAddressTwo: endAddress,
      order_phone_numberTwo: formValue.order_phone_number,
      orderTypeTwo: formValue.orderType,
      personCountTwo: formValue.personCount,
      commentTwo: formValue.comment,
      dateTwo: formValue.date,
      timeTwo: formValue.time,
      isChangeStatusTwo: formValue.isChangeStatus,
      isFreeTwo: formValue.isFree,
      isExtraTwo: formValue.isExtra
    })
    this.setDisableEnableAddress('startPointAddressTwo', 'endPointAddressTwo', subRoute, 'validateFormTwo')
    console.log('validateFormTwo', this.validateForm.value);
  }
  private setDisableEnableAddress(startControl: string, endControl: string, subRoute, formGroupName: string): void {
    if (subRoute.start_point_is_static) {
      this[formGroupName].get(startControl).disable();
    } else {
      this[formGroupName].get(startControl).enable()
    }
    if (subRoute.end_point_is_static) {
      this[formGroupName].get(endControl).disable()

    } else {
      this[formGroupName].get(endControl).enable()
    }
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
