import { Injectable } from '@angular/core';
import { HttpClient} from "@angular/common/http";
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private _httpClient: HttpClient, private cookieService: CookieService) { }



  public getDriversRatings(limit: number, offset: number, ordering: string = '', startDate: string = '', endDate: string = '', type = '') {
    return this._httpClient.get(`order/rating/?driver=&order__sub_route=&client=&ordering=${ordering}&start_date=${startDate}&end_date=${endDate}&limit=${limit}&offset=${offset}&type=${type}`//-rate
    );
  }



}
