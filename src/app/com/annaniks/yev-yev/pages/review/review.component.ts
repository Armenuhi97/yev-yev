import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReviewService } from './review.service';
import { differenceInCalendarDays } from 'date-fns';

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
  public isTable: boolean = false;
  public today = new Date();
  private reate: string = '';
  private startDate: string = '';
  private endDate: string = '';
  private type: string = '';
  constructor(public reviewgService: ReviewService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initFilterForm();
    this.nzPageIndexChange(this.pageIndex);
  }

  disabledDate = (current: Date): boolean =>
    differenceInCalendarDays(current, this.today) > 0

  private initFilterForm(): void {
    this.validateForm = this.fb.group({
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      type: [null]
    });

  }

  public submitForm(): void {
    this.startDate = this.reviewgService.createDate(this.validateForm.get('startDate').value);
    this.endDate = this.reviewgService.createDate(this.validateForm.get('startDate').value);
    let a = this.startDate.split('%');
    this.startDate = a[0]+'%2000:00';
    let b = this.endDate.split('%');
    this.endDate = b[0]+'%2023:59';
    this.type = this.validateForm.get('type')?.value;
    this.nzPageIndexChange(this.pageIndex, this.reate);
 
  }

  nzPageIndexChange(page: number, ordered?): void {
    this.pageIndex = page;
    if (this.pageIndex === 1) {
      this.offset = 0;
    } else {
      this.offset = this.limit * this.pageIndex - this.limit;
    }

    this.startDate = this.reviewgService.createDate(this.validateForm.get('startDate').value);
    let a = this.startDate.split('%');
    this.startDate = a[0]+'%2000:00';
    this.endDate = this.reviewgService.createDate(this.validateForm.get('startDate').value);
    let b = this.endDate.split('%');
    this.endDate = b[0]+'%2023:59';
    this.type = this.validateForm.get('type')?.value;
    this.reviewgService.getDriversRatings(this.limit, this.offset, ordered, this.startDate, this.endDate, this.type).subscribe((rating: any) => {
      this.total = rating.count;
      this.driversStar = rating.results;
      if (!this.driversStar.length) {
        this.isTable = true;
      }

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

}


