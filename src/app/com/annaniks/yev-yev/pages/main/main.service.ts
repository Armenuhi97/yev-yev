import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notification } from "../../core/models/notification";
import { ServerResponce } from '../../core/models/server-reponce';
import { RouteItem } from '../../core/models/routes.model';
import { CookieService } from 'ngx-cookie-service';
import { map } from 'rxjs/operators';

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
  public getUnseenNotifications(): Observable<Notification[]> {
    return this.httpClient.get<Notification[]>(`notifications/get-unseen-notifications-without-pendings/`)
  }
  public getUnseenPendingNotifications(): Observable<Notification[]> {
    return this.httpClient.get<Notification[]>(`notifications/get-unseen-pending-notifications/`)
  }
  public setSeenNotification(id: number) {
    return this.httpClient.get(`notifications/set-seen/${id}/`)
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
