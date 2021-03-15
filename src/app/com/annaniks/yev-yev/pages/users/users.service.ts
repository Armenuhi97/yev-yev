import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class UsersService { 
    constructor(private _httpClient:HttpClient){}
    getUsers(page,offset){
        return this._httpClient.get(`userdetails/user/?search=&user_role__code=CL&limit=10&offset=${offset}&page=${page}`)
    }
    public getUserById(userId:number){
        return this._httpClient.get(`userdetails/user/?search=&user_role__code=CL&id=${userId}`)
    }
    public editUser(userId:number,body){
        return this._httpClient.put(`userdetails/edit-user-details/${userId}/`,body)
    }
    public addUser(body){
        return this._httpClient.post(`userdetails/add-moderator/`,body)
    }
    public getOrders(userId:number,page:number){
        let offset=(page-1)*10;
        return this._httpClient.get(`order/order/?user_id=${userId}&page=${page}&limit=10&offset=${offset}`)
    }
}