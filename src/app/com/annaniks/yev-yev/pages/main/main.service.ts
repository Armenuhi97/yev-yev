import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notification } from "../../core/models/notification";

@Injectable({
  providedIn: 'root'
})
export class MainService {
  constructor(
    private httpClient: HttpClient,
  ) { }

  public uploadFile(file): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file_url', file);
    return this.httpClient.post<{ url: string }>(`files/files/`, formData);
  }
  public getUnseenNotifications():Observable<Notification[]> {
    return this.httpClient.get<Notification[]>(`notifications/get-unseen-notifications/`)
  }
  public setSeenNotification(id:number){
    return this.httpClient.get(`notifications/set-seen/${id}/`)
  }
}
