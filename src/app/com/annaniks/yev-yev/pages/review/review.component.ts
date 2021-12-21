import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReviewService } from './review.service';

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

  private reate: string = '';
  private startDate: string = '';
  private endDate: string = '';
  private type: string = '';
  constructor(public reviewgService: ReviewService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initFilterForm();
    this.nzPageIndexChange(this.pageIndex);
  }

  private initFilterForm(): void {
    this.validateForm = this.fb.group({
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      type: [null]
    });

  }

  private createDate(raiteDate: string): string {
    if (this.validateForm.get(raiteDate)?.value !== null) {
      const date = new Date(this.validateForm.get(raiteDate)?.value);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hours = date.getHours();
      const minut = date.getMinutes();
      return `${year}-${month}-${day}%20${hours}:${minut}`;
    }
    return '';

  }

  public submitForm(): void {
    this.startDate = this.createDate('startDate');
    this.endDate = this.createDate('endDate');
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

    this.startDate = this.createDate('startDate');
    this.endDate = this.createDate('endDate');
    this.type = this.validateForm.get('type')?.value;

    this.reviewgService.getDriversRatings(this.limit, this.offset, ordered, this.startDate, this.endDate, this.type).subscribe((rating: any) => {
      this.total = rating.count;
      this.driversStar = rating.results;
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


