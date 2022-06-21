import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServerResponce } from '../../core/models/server-reponce';
import { anyToHttpParams } from '../helpers/any-to-http-params';
import { AddressModel } from './model/address.model';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(private httpClient: HttpClient) { }
  searchAddress(params): Observable<ServerResponce<AddressModel[]>> {
    return this.httpClient.get<ServerResponce<AddressModel[]>>(`order/get-orders-by-address/`, { params: anyToHttpParams(params) }
      // ?start_date=${start}&end_date=${end}&address=${address}&route_id=${routeId}`
    );
  }
}
