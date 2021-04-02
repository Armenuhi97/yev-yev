import { Injectable } from "@angular/core";
import { OrderType } from "../models/order-type";

@Injectable({ providedIn: 'root' })

export class OrderTypeService {

    orderTypes: OrderType[] = [
        {
            id: 0,
            name_en: 'Նստատեղ'
        },
        {
            id: 2,
            name_en: 'Ավտոմեքենա'
        },
        {
            id: 1,
            name_en: 'Ուղեբեռ'
        }
    ];
    getOrderTypes() {
        return this.orderTypes
    }
    
}