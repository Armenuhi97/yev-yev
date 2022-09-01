import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ServerResponce } from '../../../../core/models/server-reponce';
import { AppService } from '../../../../core/services/app.service';
import { ReviewService } from '../../../review/review.service';
import { DriverService } from '../../drivers.service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent implements OnInit {

  @Input('userRating') userRating;
  @Input('count') count;
  @Input('editId') editId;
  public pageSize: number = 10;
  public pageIndex: number = 1;
  public limit: number = 10;
  public offset: number = 0;
  public driverStar: any = [];
  unsubscribe$ = new Subject();
  private reate: string = '';
  private startDate: string = '';
  private endDate: string = '';
  private type: string = '';
  public userId: number = 0;
  total: number;
  orders = [];
  constructor(
    private reviewService: ReviewService,
    private httpClient: HttpClient,
    private router: Router,
    private driverService: DriverService,
    private appService: AppService
  ) { }



  ngOnInit(): void { }

  nzPageIndexChange(page: number, ordered?): void {
    this.pageIndex = page;
    if (this.pageIndex === 1) {
      this.offset = 0;
    } else {
      this.offset = this.limit * this.pageIndex - this.limit;
    }
    this.getRatingResults();
  }

  private getRatingResults(): void {

    this.httpClient.get(`order/rating/?driver=${this.editId}&order__sub_route=&client=&ordering=&start_date=&end_date=&limit=${this.limit}&offset=${this.offset}&type=`)
      .subscribe((res: any) => {
        this.userRating = res.results;

      });
  }

  public sort($event): void {
    this.reate = $event;
    if (this.reate === 'ascend') {
      this.nzPageIndexChange(this.pageIndex, '-rate');
    } else if (this.reate === 'descend') {
      this.nzPageIndexChange(this.pageIndex, 'rate');
    } else if (this.reate === null) {
      this.nzPageIndexChange(this.pageIndex, '');
    }
  }

  public goToRating(index: number): void {
    const id = this.userRating[index].client.id;
    // this.router.navigate([`/dashboard/client-info/${id}`]);
    this.appService.openNewTab('/dashboard/client-info', id);

  }

}

