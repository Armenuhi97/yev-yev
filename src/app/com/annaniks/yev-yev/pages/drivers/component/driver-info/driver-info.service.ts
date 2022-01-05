import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CityItem } from '../../../../core/models/city.model';
import { ServerResponce } from '../../../../core/models/server-reponce';

@Injectable({
  providedIn: 'root'
})
export class DriverInfoService {

  constructor(private httpClient: HttpClient) { }

  public getUsers(id: number, body: {}) {
    return this.httpClient.put(`userdetails/edit-user-details/${id}/`, body);
  }

  public getDriver(id: number) {
    return this.httpClient.get(`userdetails/user/?search=&user_role__code=DR&id=${id}`);
  }

  public getCitys() {
    return this.httpClient.get<ServerResponce<CityItem[]>>(`utils/city/?limit=100000`);
  }

}
