import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notification, PendingNotification } from "../../core/models/notification";
import { ServerResponce } from '../../core/models/server-reponce';
import { RouteItem } from '../../core/models/routes.model';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  role: string
  constructor(
    private httpClient: HttpClient,
    private _cookieService: CookieService) {
    this.role = this._cookieService.get('role')
  }

  public uploadFile(file): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file_url', file);
    return this.httpClient.post<{ url: string }>(`files/files/`, formData);
  }

  public getUnseenNotificationCount(): Observable<{ count: number }> {
    return this.httpClient.get<{ count: number }>(`notifications/get-unseen-notifications-without-pendings-count/`)
  }
  public getUnseenPendingNotificationCount(): Observable<{ count: number }> {
    return this.httpClient.get<{ count: number }>(`notifications/get-unseen-pending-notifications-count/`)
  }
  // Notification[] | PendingNotification
  public getUnseenNotifications(type?: string, page?: number): Observable<ServerResponce<any>> {
    let url: string;
    if (type === 'pending') {
      url = `notifications/get-unseen-pending-notifications/`;
    } else {
      url = `notifications/get-unseen-notifications-without-pendings/`;
    }
    url += `?page=${page}`;
    return this.httpClient.get<ServerResponce<any>>(url);
  }
  public getUnseenPendingNotifications(): Observable<Notification[]> {
    return this.httpClient.get<Notification[]>(`notifications/get-unseen-pending-notifications/`);
  }
  public setSeenNotification(id: number): Observable<string> {
    return this.httpClient.get<string>(`notifications/set-seen/${id}/`);
  }
  public setSeenAllNotification(): Observable<string> {
    return this.httpClient.get<string>(`notifications/set-all-seen/`);
  }
  public setSeenExtraNotification(id: number): Observable<string> {
    return this.httpClient.get<string>(`order/change-extra-order-seen/${id}/`);
  }
  public getAllRoutes(page: number): Observable<ServerResponce<RouteItem[]>> {
    let offset = (page - 1) * 10;

    return this.httpClient.get<ServerResponce<RouteItem[]>>(`route/main-route/?only_my=True&page=${page}&limit=10&offset=${offset}`)
  }
  public getExtraOrdersCount() {
    return this.httpClient.get(`order/get-new-extra-order-count/`)
  }
  public getSound() {
    return this.httpClient.get(`/assets/notification.mp3`)
  }
}
