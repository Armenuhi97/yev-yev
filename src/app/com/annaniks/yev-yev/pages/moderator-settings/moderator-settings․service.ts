import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class ModeratorSettingsService{
    constructor(private _httpClient:HttpClient){}
    public changePassword(id:number,body){
        return this._httpClient.put(`login/change-password/${id}/`,body)
    }
    public changeUserName(id:number,body){
        return this._httpClient.put(`login/change-username/${id}/`,body)
    }
}