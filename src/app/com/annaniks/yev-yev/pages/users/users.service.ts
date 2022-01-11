import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class UsersService {
    constructor(private _httpClient: HttpClient) { }
    getUsers(page, offset: number, search, ordering?) {
        if (!search) {
            search = ''
        }

          //                           userdetails/user/?search=&user_role__code=CL&limit=10&offset=0&page=1&search=&ordering=
        return this._httpClient.get(`userdetails/user/?search=&user_role__code=CL&limit=10&offset=${offset}&page=${page}&search=${search}&ordering=${ordering}`)
    }
    public getUserById(userId: number) {
      
        return this._httpClient.get(`userdetails/user/?search=&user_role__code=CL&id=${userId}`)
    }
    public editUser(userId: number, body) {
        return this._httpClient.put(`userdetails/edit-user-details/${userId}/`, body)
    }
    public addUser(body) {
        return this._httpClient.post(`userdetails/add-client/`, body)
    }
    public getOrders(userId: number | string, page: number) {
        let offset = (page - 1) * 10;

        return this._httpClient.get(`order/order/?user_id=${userId}&page=${page}&limit=10&offset=${offset}`)
    }

    public getRating(id: number | string) {
        return this._httpClient.get(`order/rating/?driver=&order__sub_route=&client=${id}&ordering=&start_date=&end_date=&limit=&offset=&type=`);
    }
}