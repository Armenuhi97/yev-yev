import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StarServiceService {

  constructor(private _httpClient: HttpClient) { }

  public getRatedDrivers(start: string, end: string, id: number, limit:number, rating:string) {
     //http://yev.annaniks.com/order/rating/get-rated-drivers/?start_date=2021-12-1&end_date=2021-12-30&main_route=6&ordering=rate_car&limit=5
    return this._httpClient.get(`/order/rating/get-rated-drivers/?start_date=${start}&end_date=${end}&main_route=${id}&ordering=${rating}&limit=${limit}`)
  }
}
