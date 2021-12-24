import { Injectable } from '@angular/core';
import { HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private _httpClient: HttpClient) { }



  public getDriversRatings(limit: number, offset: number, ordering: string = '', startDate: string = '', endDate: string = '', type = '') {
    return this._httpClient.get(`order/rating/?driver=&order__sub_route=&client=&ordering=${ordering}&start_date=${startDate}&end_date=${endDate}&limit=${limit}&offset=${offset}&type=${type}`//-rate
    );
  }



}
