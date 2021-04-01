import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "../../core/models/salary";

@Injectable()
export class SalaryService{
    constructor(private _httpClient:HttpClient){}
    getUsers(page){
        let offset=(page-1)*10
        return this._httpClient.get(`userdetails/user/?search=&user_role__code=MDR&page=${page}&limit=10&offset=${offset}`)
    }
    public getUserById(userId:number){
        return this._httpClient.get(`userdetails/user/?search=&user_role__code=MDR&id=${userId}`)
    }
    public editUser(userId:number,body){
        return this._httpClient.put(`userdetails/edit-user-details/${userId}/`,body)
    }
    public addUser(body){
        return this._httpClient.post(`userdetails/add-moderator/`,body)
    }
    public changePassword(id:number,body){
        return this._httpClient.put(`login/change-password/${id}/?is_admin=true`,body)
    }
}