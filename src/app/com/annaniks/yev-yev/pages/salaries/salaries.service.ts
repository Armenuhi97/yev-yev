import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class SalaryService{
    constructor(private _httpClient:HttpClient){}
    getUsers(page,){
        // ?search=&user_role__code=DR&user__is_active=true&driving_routes__main_route=1&user_id=12
        return this._httpClient.get(`userdetails/user/?search=&user_role__code=MDR&page=${page}`)
    }
    public getUserById(userId:number){
        return this._httpClient.get(`userdetails/user/?search=&user_role__code=MDR&id=${userId}`)
    }
    public deleteUserById(userId:number){
        return this._httpClient.delete(`/userdetails/delete-user-details/${userId}/`)
    }
    public editUser(userId:number,body){
        return this._httpClient.put(`/userdetails/edit-user-details/${userId}/`,body)
    }
    public addUser(body){
        return this._httpClient.post(`userdetails/add-moderator/`,body)
    }
}