import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class DriverOrdersService {

  constructor(private httpClient: HttpClient) { }
  public changeOrderComment(id: number, comment: string): Observable<string> {
    return this.httpClient.put<string>(`order/change-comment-note/${id}/`, { comment_note: comment })
  }
}
