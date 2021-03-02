import { Injectable } from "@angular/core";

@Injectable({providedIn:'root'})
export class AppService{
    public checkPropertyValue(object: object | Array<any>, element: string | number, returnValue = null) {
        return (object != null && object[element]) ? object[element] : returnValue;
    }
}