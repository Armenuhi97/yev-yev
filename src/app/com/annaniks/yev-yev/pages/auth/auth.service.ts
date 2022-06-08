import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { LoginSendResponse } from "../../core/models/login.model";

@Injectable()
export class AuthService {
  constructor(private _httpClient: HttpClient) { }
  public loginAdmin(body: LoginSendResponse): Observable<{ token: string, }> {
    let params = new HttpParams();
    params = params.set('authorization', 'false');
    return this._httpClient.post<{ token: string }>('login/login/', body, { params })
  }
}