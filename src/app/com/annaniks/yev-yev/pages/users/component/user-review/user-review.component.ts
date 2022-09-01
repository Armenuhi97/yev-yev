import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../../../../core/services/app.service';
import { ReviewService } from '../../../review/review.service';


@Component({
  selector: 'app-user-review',
  templateUrl: './user-review.component.html',
  styleUrls: ['./user-review.component.css']
})
export class UserReviewComponent implements OnInit {

  @Input('clientRating') clientRating;
  @Input('count') count;
  @Input('userId') userId;

  ngOnInit(): void { }

  public pageSize: number = 10;
  public pageIndex: number = 1;
  public limit: number = 10;
  public offset: number = 0;
  public driverStar: any = [];
  ordered: string = '';
  private reate: string = '';
  private startDate: string = '';
  private endDate: string = '';
  private type: string = '';


  constructor(
    private reviewService: ReviewService,
    private _httpClient: HttpClient,
    private router: Router,
    private appService: AppService
  ) { }

  nzPageIndexChange(page: number, ordered?): void {
    this.pageIndex = page;
    if (this.pageIndex === 1) {
      this.offset = 0;
    } else {
      this.offset = this.limit * this.pageIndex - this.limit;
    }
    this.getRatingResults();
  }


  public getRatingResults(): void {
    this._httpClient.get(`order/rating/?driver=&order__sub_route=&client=${this.userId}&ordering=${this.ordered}&start_date=&end_date=&limit=${this.limit}&offset=${this.offset}&type=`)
      .subscribe((res: any) => {
        this.clientRating = res.results;
      });
  }

  public sort($event): void {
    this.reate = $event;
    if (this.reate === 'ascend') {
      this.ordered = '-rate_avg';
    } else if (this.reate === 'descend') {
      this.ordered = 'rate_avg';
    } else if (this.reate === null) {
      this.ordered = '';
    }

    this.nzPageIndexChange(this.pageIndex, this.ordered);
  }

  public getToDriver(index: number): void {
    const id = this.clientRating[index].driver.id;
    // this.router.navigate([`/dashboard/driver-info/${id}`]);
    this.appService.openNewTab('/dashboard/driver-info', id);

  }
}
