import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DriverOrdersService } from '../../driver-orders.service';

@Component({
  selector: 'app-change-comment',
  templateUrl: './change-comment.component.html',
  styleUrls: ['./change-comment.component.css']
})
export class ChangeCommentComponent implements OnInit, OnChanges, OnDestroy {
  private insubscribe$ = new Subject<void>();
  @Input() isVisible = false;
  @Input() order;
  @Output() close = new EventEmitter<boolean | string>(false);
  commentControl = new FormControl(null);
  constructor(private driverOrdersService: DriverOrdersService) { }

  ngOnChanges(): void {
    if (!!this.order) {
      this.commentControl.setValue(this.order.comment_note);
    }
  }

  ngOnInit(): void {
  }

  onSave(): void {
    const value = this.commentControl.value;
    this.driverOrdersService.changeOrderComment(this.order.id, value).pipe(takeUntil(this.insubscribe$)).subscribe(() => {
      this.closeModal(value);
    });
  }
  handleCancel(): void {
    this.closeModal(false);
  }
  closeModal(value: string | boolean): void {
    this.isVisible = false;
    this.commentControl.reset();
    this.close.emit(value);
  }
  ngOnDestroy(): void {
    this.insubscribe$.next();
    this.insubscribe$.complete();
  }
}
