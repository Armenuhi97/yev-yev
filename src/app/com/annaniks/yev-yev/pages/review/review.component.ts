import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReviewService } from './review.service';
import { differenceInCalendarDays } from 'date-fns';
import { Router } from '@angular/router';


@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {

  validateForm: FormGroup;

  public total: number = 10;
  public pageSize: number = 10;
  public pageIndex: number = 1;
  public limit: number = 10;
  public offset: number = 0;
  public driversStar: any[] = [];
  public today = new Date();
  private reate: string = '';
  private startDate: string = '';
  private endDate: string = '';
  private type: string = '';
  private ordered: string = '';
  constructor(
    public reviewgService: ReviewService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.initFilterForm();
    this.showDefolteDate();
    this.nzPageIndexChange(this.pageIndex);
  }

  disabledDate = (current: Date): boolean =>
    differenceInCalendarDays(current, this.today) > 0

  private initFilterForm(): void {
    this.validateForm = this.fb.group({
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      type: ['']
    });

  }

  private showDefolteDate(): void {
    this.validateForm.patchValue({
      startDate: new Date('2021-12-19'),
      endDate: new Date()
    });
  }

  public submitForm(): void {
    this.startDate = this.reviewDate('startDate');
    this.endDate = this.reviewDate('endDate');
    this.type = this.validateForm.get('type')?.value;
    this.pageIndex = 1;

    this.nzPageIndexChange(this.pageIndex, this.reate);
  }

  private reviewDate(date: string): string {
    let key = '';
    if (date === 'startDate') {
      if (this.validateForm.get(date).value) {
        key = this.reviewgService.createDate(this.validateForm.get(date).value) + '%2000:00';
      } else {
        key = '';
      }
    } else {
      if (this.validateForm.get(date).value) {
        key = this.reviewgService.createDate(this.validateForm.get(date).value) + '%2023:59';
      } else {
        key = '';
      }
    }
    return key;
  }

  private addOffset(page: number): void {
    this.pageIndex = page;
    if (this.pageIndex === 1) {
      this.offset = 0;
    } else {
      this.offset = this.limit * this.pageIndex - this.limit;
    }
  }

  nzPageIndexChange(page: number, ordered?): void {
    this.addOffset(page);

    this.startDate = this.reviewDate('startDate');
    this.endDate = this.reviewDate('endDate');
    this.type = this.validateForm.get('type')?.value;
    // if (this.type === 'bad' || this.type === 'good') {
    //   this.offset = 0;
    // }

    this.reviewgService.getDriversRatings(this.limit, this.offset, this.ordered, this.startDate, this.endDate, this.type)
      .subscribe((rating: any) => {
        this.total = rating.count;
        this.driversStar = rating.results;
        if (this.type === 'bad' || this.type === 'good') {
          this.addOffset(page);
          // this.total = rating.count;
          // this.driversStar = rating.results;
          console.log(this.offset);
        }

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

  public goToUser(clientId: number): void {
    this.router.navigate([`/dashboard/client-info/${clientId}`]);
  }

  public goToDriver(id: number): void {
    this.router.navigate([`/dashboard/driver-info/${id}`]);
  }
}


