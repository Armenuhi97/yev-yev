import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RatingOrderServiceService {

  constructor(private _httpClient: HttpClient) { }
  public getAppovedOrder(id: number) {
    return this._httpClient.get(`/order/approved-order/${id}/get-full/`);
  }
}
