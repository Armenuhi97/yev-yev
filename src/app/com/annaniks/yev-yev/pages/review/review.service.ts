import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private _httpClient: HttpClient) { }



  public getDriversRatings(limit: number, offset: number, ordering: string = '', startDate: string = ' ', endDate: string = ' ', type = '') {
    if (startDate === ' ' || endDate === ' ') {
      return this._httpClient.get(`order/rating/?driver=&order__sub_route=&client=&ordering=${ordering}&start_date=&end_date=&limit=${limit}&offset=${offset}&type=${type}`//-rate
      );
    } else {
      return this._httpClient.get(`order/rating/?driver=&order__sub_route=&client=&ordering=${ordering}&start_date=${startDate}&end_date=${endDate}&limit=${limit}&offset=${offset}&type=${type}`//-rate
      );
    }


  }

  public createDate(validateForm: any): string {
    if (validateForm !== null) {
      const date = new Date(validateForm);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      // const hours = date.getHours();
      // const minut = date.getMinutes();
      // return `${year}-${month}-${day}%20${hours}:${minut}`;
      return `${year}-${month}-${day}`;
    }
    return '';
  }

}
