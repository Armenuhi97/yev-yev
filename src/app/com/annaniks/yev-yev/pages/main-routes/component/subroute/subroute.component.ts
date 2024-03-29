import { DatePipe } from "@angular/common";
import { Component, EventEmitter, HostListener, Input, Output } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd/message";
import { forkJoin, Observable, Subject } from "rxjs";
import { map, switchMap, takeUntil } from "rxjs/operators";
import { ClosedHours } from "../../../../core/models/closed-hours";
import { OrderType } from "../../../../core/models/order-type";
import { OrdersByHours, SubrouteDetails } from "../../../../core/models/orders-by-hours";
import { ServerResponce } from "../../../../core/models/server-reponce";
import { AppService } from "../../../../core/services/app.service";
import { MainRoutesService } from "../../main-routes.service";
import * as moment from 'moment-timezone';
import { Notification } from "../../../../core/models/notification";
import { NotificationService } from "../../../../core/services/notification.service";
import { CountDto } from "../../../../core/models/dto/routes.dto.model";
import { Counts } from "../../../../core/models/routes.model";
import { Messages } from "../../../../core/models/mesages";

@Component({
  selector: 'app-subroute',
  templateUrl: 'subroute.component.html',
  styleUrls: ['subroute.component.scss'],
  providers: [DatePipe]
})
export class SubrouteComponent {
  currentDriver = []
  isVisibleOrderInfo: boolean = false;
  isOrderEditing: boolean = false;
  orderMembers = []
  editOrderIndex: number
  approvedOrders = []
  public subrouteInfo: SubrouteDetails;
  selectedTime;
  public driver;
  public tableCounts!: Counts
  isVisible: boolean = false;
  unsubscribe$ = new Subject();
  validateForm: FormGroup;
  phoneNumberPrefix = new FormControl('+374')
  userId: number;
  currentInterval;
  lastDate;
  notifications: Notification[] = [];
  isShowError: boolean = false;
  @HostListener('window:resize', ['$event'])
  private _onResize(): void {
    if (window.innerWidth <= 1121) {
      this.windowHeight = (this.getWidth() - 37);
    } else {
      this.windowHeight = this.getWidth();
    }
  }

  orderTypes: OrderType[] = [
    {
      id: 0,
      name_en: 'Նստատեղ'
    },
    {
      id: 1,
      name_en: 'Ավտոմեքենա'
    },
    {
      id: 2,
      name_en: 'Ուղեբեռ'
    }
  ];
  radioValue: string = "approved";
  isEditing: boolean;
  editIndex;
  @Output('openDriverModal') _openDriverModal = new EventEmitter<void>();
  @Output('getInfo') private _info = new EventEmitter();
  @Output('resetItem') private _reset = new EventEmitter();
  @Output('resetItem2') private _reset2 = new EventEmitter();


  @Output('subrout') subrout = new EventEmitter();
  @Input() subrouteReturnId: number;
  index: number;
  @Input('index')
  set setIndex($event) {
    this.index = +$event
  }
  @Input('info')
  set setInfo($event) {
    this.subrouteInfo = $event;

    if (this.subrouteInfo && this.subrouteInfo.countList?.orders) {
      for (let item of this.subrouteInfo.countList.orders) {
        let date = this._datePipe.transform(new Date(item.hour), 'HH:mm');
        for (let time of this.subrouteInfo.openTimes) {
          if (time.time.startsWith(date)) {
            time = Object.assign(time, {
              approved_seat_count: this._appService.checkPropertyValue(this._appService.checkPropertyValue(item, 'order'), 'approved_seat_count', 0),
              pending_seat_count: this._appService.checkPropertyValue(this._appService.checkPropertyValue(item, 'order'), 'pending_seat_count', 0),
              seat_count: this._appService.checkPropertyValue(this._appService.checkPropertyValue(item, 'order'), 'seat_count', 0),
              luggage_type_count: this._appService.checkPropertyValue(this._appService.checkPropertyValue(item, 'order'), 'luggage_type_count', 0)
            })

          }
        }
      }
    }
    if (this.subrouteInfo && this.subrouteInfo.selectTime) {

      let time = this.subrouteInfo.openTimes.filter((data) => {
        return (this.subrouteInfo.selectTime >= data.start && this.subrouteInfo.selectTime < data.end)
      });
      if (time && time[0]) {
        this.selectedTime = time[0];
        setTimeout(() => {
          let element = document.getElementById(this.setId(time[0].start, this.index));
          element.scrollIntoView();
        }, 500);

        this.getInformation(time[0])
      }
    }
  }

  isGetOrderCounts: boolean;
  @Input('isGetItem')
  set isGetItem($event) {

    this.isGetOrderCounts = $event;
    this.isGetOrderCounts = true;
    this.actionInChange($event, this.selectedTime);
  }
  @Input('isUpdateBack')
  set setIsUpdateItem($event) {
    this.actionInChange(true, $event, true);
  }
  @Input('getOtherRouteOrdersCount')
  set setOrdersCount($event) {
    if ($event) {
      this.onClickRefresh();
    }
  }
  private _date;
  @Input('date')
  set setDate($event) {
    this._date = $event;
    if (this._date) {
      this.currentInterval = null;
      if (!this.subrouteInfo.selectTime)
        this.selectedTime = null;
    }
    if (this.subrouteInfo && this._date) {
      forkJoin([
        this.getBlockedHours(this.subrouteInfo.id),
        this.getClosedHours(this.subrouteInfo.id)

      ]).pipe(
        switchMap(() => {
          return this.getHourlyOrdersByDate();
        })
      ).subscribe();
    }


  }

  public onClickRefresh() {
    forkJoin([
      this.getBlockedHours(this.subrouteInfo.id),
      this.getClosedHours(this.subrouteInfo.id)

    ]).pipe(
      switchMap(() => {
        return this.getHourlyOrdersByDate();
      })
    ).subscribe();
  }

  windowHeight: number;
  public title: string = '';
  userInfo: OrdersByHours[] = []
  constructor(
    private _datePipe: DatePipe,
    private _mainRouteService: MainRoutesService,
    private _appService: AppService,
    private notificationService: NotificationService,
    private nzMessages: NzMessageService,) {
    this._onResize()
  }

  ngOnInit() {
    this.getHourlyOrdersByDate();
    if (this.subrouteInfo && this.subrouteInfo.start_point_city) {
      this.title = `${this.subrouteInfo.start_point_city.name_hy} - ${this.subrouteInfo?.end_point_city.name_hy}`
    }
    this.getCount();

  }
  getWidth(): number {
    return window.innerHeight - 260.41 - 43;
  }
  private actionInChange($event, time, isBackRoute?) {
    if ($event && time) {
      this.getHourlyOrdersByDate(isBackRoute).pipe(takeUntil(this.unsubscribe$)).subscribe()
    }
  }

  getHourlyOrdersByDate(isBackRoute?: boolean): Observable<any> {

    let date = this._datePipe.transform(this._date, 'yyyy-MM-dd');
    return this._mainRouteService.getHourlyOrdersByDate(this.subrouteInfo.id, date)
      .pipe(map((data: any) => {
        this.subrouteInfo.openTimes = this.subrouteInfo.openTimes.map(
          (el) => {
            return Object.assign(el, {
              approved_seat_count: 0,
              pending_seat_count: 0,
              seat_count: 0,
              luggage_type_count: 0
            });
          });
        for (let item of data) {
          let dateFormat = moment(item.hour).format('HH:mm');
          let date = moment(dateFormat, "HH:mm");
          for (let time of this.subrouteInfo.openTimes) {
            let start = moment(time.start, "HH:mm");
            let end = moment(time.end, "HH:mm");
            if ((moment(date).isSameOrAfter(start) && moment(date).isBefore(end))) {
              time = Object.assign(time, {
                approved_seat_count: this._appService.checkPropertyValue(this._appService.checkPropertyValue(item, 'order'), 'approved_seat_count', 0),
                pending_seat_count: this._appService.checkPropertyValue(this._appService.checkPropertyValue(item, 'order'), 'pending_seat_count', 0),
                seat_count: this._appService.checkPropertyValue(this._appService.checkPropertyValue(item, 'order'), 'seat_count', 0),
                luggage_type_count: this._appService.checkPropertyValue(this._appService.checkPropertyValue(item, 'order'), 'luggage_type_count', 0),
              });
            }

          }
        }
        if (isBackRoute) {
          this._reset2.emit(null);
        } else {
          this._reset.emit(false);
        }
      }));
  }

  public getCount() {
    const date = this._datePipe.transform(this._date, 'yyyy-MM-dd');
    const details = new CountDto(this.subrouteInfo.id, this.subrouteReturnId, date, this.subrouteInfo.main_route)
    this._mainRouteService.getCounts(details).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (counts) => {
        this.tableCounts = counts[0]
      }
    })
  }

  setBlockOrCloseHours(items, key, idKey) {
    for (let item of items) {
      let date = this._datePipe.transform(new Date(item.time), 'HH:mm');
      for (let time of this.subrouteInfo.openTimes) {
        if (time.time.startsWith(date)) {
          time[key] = key == 'isBlocked' ? false : true;
          time[idKey] = item.id
        }
        if (key == 'isBlocked')
          this.checkCloseTimes(time)
      }
    }
  }
  showDriverRoutesModal(): void {
    this._openDriverModal.emit()
  }
  private formatSelectedDate(): string {
    const date = this._datePipe.transform(this._date, 'YYYY-MM-dd');
    return date
  }
  openAll(): void {
    const date = this.formatSelectedDate();
    this._mainRouteService.closeAllHours(date, this.subrouteInfo.id).pipe(takeUntil(this.unsubscribe$),
      switchMap((data) => {
        return forkJoin([
          this.getBlockedHours(this.subrouteInfo.id),
          this.getClosedHours(this.subrouteInfo.id)
        ])
        // return this.getRouteInfo(this.subrouteInfo.main_route);
      })).subscribe();
  }
  closeAll(): void {
    const date = this.formatSelectedDate();
    this._mainRouteService.removeAllCloseHour(date, this.subrouteInfo.id).pipe(takeUntil(this.unsubscribe$),
      switchMap(() => {
        this.subrouteInfo.openTimes = this.subrouteInfo.openTimes.map((el) => { return Object.assign({}, el, { closeId: null }) });
        return forkJoin([
          this.getBlockedHours(this.subrouteInfo.id),
          this.getClosedHours(this.subrouteInfo.id)
        ])

        // return this.getRouteInfo(item.main_route);
      })).subscribe();
  }
  public getBlockedHours(id: number) {
    let date = this._datePipe.transform(this._date, 'yyyy-MM-dd');
    return this._mainRouteService.getBlockedHours(id, date).pipe(takeUntil(this.unsubscribe$), map((data: ServerResponce<ClosedHours[]>) => {
      this.subrouteInfo.openTimes.map((val) => { return Object.assign(val, { isBlocked: true }) })
      let items = data.results;
      this.setBlockOrCloseHours(items, 'isBlocked', 'blockId')
      if (!items.length) {
        for (let time of this.subrouteInfo.openTimes) {
          this.checkCloseTimes(time)
        }
      }
    }))
  }

  public getClosedHours(id: number): Observable<any> {
    let date = this._datePipe.transform(this._date, 'yyyy-MM-dd');
    return this._mainRouteService.getCloseHours(id, date).pipe(takeUntil(this.unsubscribe$), map((data: ServerResponce<ClosedHours[]>) => {
      this.subrouteInfo.openTimes.map((val) => { return Object.assign(val, { isActive: false }) })
      let items = data.results
      this.setBlockOrCloseHours(items, 'isActive', 'closeId')
    }))
  }
  openOrCloseHour($event, data) {
    if (data.closeId) {
      this._mainRouteService.openHours(data.closeId).pipe(takeUntil(this.unsubscribe$)).subscribe(() => { data.closeId = null },
        (err) => {
          data.isActive = !$event;
          this.nzMessages.error(err?.error?.message || Messages.fail);
        })
    } else {
      let current = this._formatDate(data.time)
      this._mainRouteService.closeHours(this.subrouteInfo.id, current).pipe(takeUntil(this.unsubscribe$)).subscribe((val: { id: number }) => {
        data.closeId = val.id
      },
        (err) => {
          data.isActive = !$event;
          this.nzMessages.error(err?.error?.message || Messages.fail);
        })
    }
  }
  blockOrUnBlockHour($event, data) {
    if (data.blockId && $event) {
      this._mainRouteService.openBlockedHours(data.blockId).pipe(takeUntil(this.unsubscribe$)).subscribe()
    } else {
      let current = this._formatDate(data.time)
      this._mainRouteService.blockHour(this.subrouteInfo.id, current).pipe(takeUntil(this.unsubscribe$)).subscribe((val: { id: number }) => {
        data.blockId = val.id

      })
    }
  }

  check(item) {
    return item ? +item : ''
  }
  calculateEmptyCount(data) {
    let emptyPlaces = (+this.check(data.seat_count) - +this.check(data.approved_seat_count))
    return emptyPlaces ? emptyPlaces : ''
  }
  getInformation(time) {
    this.selectedTime = time.time;
    let date = this._datePipe.transform(this._date, 'yyyy-MM-dd');
    this._info.emit({ timeItem: time, time: time.time, isUnChange: true, date: date })
    // this.getInfo(time, status).subscribe()
  }

  private _formatDate(time, selectDate = this._date) {
    let date = this._datePipe.transform(selectDate, 'yyyy-MM-dd');
    let currenTime = time.slice(0, time.indexOf(' '))
    let current = `${date} ${currenTime}`;
    return current
  }

  get tableTitle() {
    if (this.subrouteInfo && this.subrouteInfo.start_point_city) {
      return `${this.subrouteInfo.start_point_city.name_hy} - ${this.subrouteInfo?.end_point_city.name_hy}`
    } else {
      return
    }
  }


  checkCloseTimes(data) {
    var timezone = 'Asia/Yerevan';
    let currentTime = moment().tz(timezone).format('HH:mm')
    let currentDateFormat = moment().tz(timezone).format('DD.MM.yyyy');
    let currentDate = moment(currentDateFormat, "DD.MM.yyyy")
    let item = moment(this._date).format("DD.MM.yyyy")
    let selectedDate = moment(item, "DD.MM.yyyy");
    let time = moment(currentTime, "HH:mm");
    let start = moment(data.start, "HH:mm");
    let end = moment(data.end, "HH:mm");
    if (moment(selectedDate).isBefore(currentDate)) {
      data.isDisabled = true;
      data.isBlocked = false
    }
    if (moment(selectedDate).isAfter(currentDate)) {
      data.isDisabled = false;
    }
    if (moment(selectedDate).isSame(currentDate)) {
      if ((moment(time).isSameOrAfter(start) && moment(time).isBefore(end)) || (moment(time).isBefore(start))) {
        data.isDisabled = false
      } else {

        data.isDisabled = true;
        data.isBlocked = false
      }
      if ((moment(time).isSameOrAfter(start) && moment(time).isBefore(end))) {

        let element = document.getElementById(this.setId(data.start, this.index));
        element.scrollIntoView();
        this.currentInterval = data;

      }
    }

  }
  setId(id: string, index: number): string {
    return `${id}-${index}`
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
