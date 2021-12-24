import { DatePipe } from "@angular/common";
// import { ServerResponce } from "../../core/models/server-reponce";
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
  unsubscribe$ = new Subject();
  filterForm: FormGroup;
  mainRoutes: RouteItem[] = [];
  public person: string;
  public clientRoutes: DailyUserOrderType[];
  public driverRoutes: DailyDriverOrderType;
  public today = new Date();
  constructor(private _fb: FormBuilder,
    private _mainService: MainService,
    private starService: StarServiceService
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

  private createDate(craiteDate: string): string {
    if (this.filterForm.get(craiteDate)?.value !== null) {
      const date = new Date(this.filterForm.get(craiteDate)?.value);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hours = date.getHours();
      const minut = date.getMinutes();
      return `${year}-${month}-${day}`;
    }

  }
  public submitForm() {
    if (this.filterForm.valid) {
      const start = this.createDate('startDate');
      const end = this.createDate('endDate');
      const id = this.filterForm.get('mainRoute').value;
      const limit = this.filterForm.get('size').value;
      this.rating = this.filterForm.get('rating').value;
      this.starService.getRatedDrivers(start, end, id, limit, this.rating)
        .subscribe((res: any) => {
          this.starRating = res;
        });

    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
