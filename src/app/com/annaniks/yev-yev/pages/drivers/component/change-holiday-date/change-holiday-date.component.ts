import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { differenceInCalendarDays } from 'date-fns';

@Component({
  selector: 'app-change-holiday-date',
  templateUrl: './change-holiday-date.component.html',
  styleUrls: ['./change-holiday-date.component.css']
})
export class ChangeHolidayDateComponent implements OnInit {
  @Input() isVisible: boolean;
  today = new Date();
  holidayDate = new FormControl(null, Validators.required);
  @Output() close = new EventEmitter<null | Date>();
  @Input('driver')
  set setValue(evt) {
    if (!!evt) {
      this.holidayDate.setValue(evt.holiday_date ? new Date(evt.holiday_date) : null);
    }
  }
  constructor() { }

  ngOnInit(): void {
  }
  handleCancel(): void {
    this.isVisible = false;
    this.close.emit();
  }
  disabledDate = (current: Date): boolean =>
    differenceInCalendarDays(this.today, current) > 0

  onSave(): void {
    if (this.holidayDate.valid) {
      this.close.emit(this.holidayDate.value);
    }
  }
}
