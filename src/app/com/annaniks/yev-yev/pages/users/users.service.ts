import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class UsersService { 
    constructor(private _httpClient:HttpClient){}
    getUsers(page){
        return this._httpClient.get(`userdetails/user/?search=&user_role__code=CL&page=${page}`)
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
    public getOrders(page:number){
        return this._httpClient.get(`?page=${page}`)
    }
}