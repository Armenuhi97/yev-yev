import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Notification } from '../models/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notificationEvent$ = new BehaviorSubject<Notification[]>([]);
  constructor() { }
  getNotificationState(): Observable<Notification[]> {
    return this.notificationEvent$.asObservable();
  }
  setNotificationState(data): void {
    this.notificationEvent$.next(data);
  }
}
