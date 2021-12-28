import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subject } from "rxjs";
import { map, takeUntil } from "rxjs/operators";
import { RouteItem } from "../../core/models/routes.model";
import { MainService } from "../main/main.service";
import { ServerResponce } from "../../core/models/server-reponce";
import { DailyDriverOrderType, DailyUserOrderType } from "../../core/models/daily-order.model";
import { differenceInCalendarDays } from 'date-fns';
import { StarServiceService } from "./star-service.service";
import { ReviewService } from "../review/review.service";

@Component({
  selector: 'app-star',
  templateUrl: './star.component.html',
  styleUrls: ['./star.component.css']
})
export class StarComponent implements OnInit {

  public total: number = 10;
  public pageSize: number = 10;
  public pageIndex: number = 1;
  public limit: number = 10;
  public offset: number = 0;
  public starRating: any[] = [];
  public rating: string = '';
  public isTable: boolean = false;
  unsubscribe$ = new Subject();
  filterForm: FormGroup;
  mainRoutes: RouteItem[] = [];
  public person: string;
  public clientRoutes: DailyUserOrderType[];
  public driverRoutes: DailyDriverOrderType;
  public today = new Date();

  public optionRating: any[] = [
    { value: 'rate_avg', title: 'Միջին' },
    { value: 'rate_car', title: 'Մեքենա' },
    { value: 'rate_service', title: 'Սերվիս' },
    { value: 'rate_driver', title: 'Վարորդ' }
  ];
  constructor(private _fb: FormBuilder,
    private _mainService: MainService,
    private starService: StarServiceService,
    private reviewService: ReviewService
  ) { }

  ngOnInit() {
    this.initFilterForm();
    this.getOrders();
  }

  private initFilterForm(): void {
    this.filterForm = this._fb.group({
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      mainRoute: [null, [Validators.required]],
      size: [null, [Validators.required]],
      rating: [null, [Validators.required]]
    });
  }

  disabledDate = (current: Date): boolean =>
    differenceInCalendarDays(current, this.today) > 0

  getOrders() {
    this._mainService.getAllRoutes(1).pipe(
      takeUntil(this.unsubscribe$),
      map((data: ServerResponce<RouteItem[]>) => {
        this.mainRoutes = data.results;
        if (this.mainRoutes && this.mainRoutes.length) {
          this.filterForm.get('mainRoute').setValue(this.mainRoutes[0].id)
        }
      })
    ).subscribe();
  }

  public submitForm() {
    if (this.filterForm.valid) {
      let start = this.reviewService.createDate(this.filterForm.get('startDate').value) + '%2000:00';
      // let a = start.split('%');
      // start = a[0] + '%2000:00';

      let end = this.reviewService.createDate(this.filterForm.get('endDate').value) + '%2023:59';
      // let b = end.split('%');
      // end = b[0] + '%2023:59';

      const id = this.filterForm.get('mainRoute').value;
      const limit = this.filterForm.get('size').value;
      this.rating = this.filterForm.get('rating').value;
      this.starService.getRatedDrivers(start, end, id, limit, this.rating)
        .subscribe((res: any) => {
          this.starRating = res;

          if (!this.starRating.length) {
            this.isTable = true;
          }
        });
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
