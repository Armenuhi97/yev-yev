import { CityItem } from "./city.model";

export interface SalaryRespone {
    "first_name": string
    "last_name": string
    "phone_number": string
    "image": string
    "username": string
    "car_model"?: null,
    "car_color"?: null,
    "car_number"?: null,
    "car_capacity"?: null
    driving_routes?: any
}
export interface User {
    viber_id: number
    "id": number,
    main_city?:CityItem,
    located_city?:CityItem
    "user": {
        "id": number,
        "first_name": string
        "last_name": string
        "is_active": true
        username: string
    },
    "driving_routes": Array<
        {
            "main_route_details": {
                "id": number,
                "route_name": string
                "created_at": string
            }
        }
    >,
    "phone_number": string,
    "image": string,
    is_free:boolean
    person_count: number
    "car_model": null,
    "car_color": null,
    "car_number": null,
    "car_capacity": number,
    "comment": null,
    car_color_name_hy: string
    car_color_name_en: string
    car_color_name_ru: string
    "user_role": number

}
export interface Client {
    canceled_orders: 1
    id: number
    image: string
    orders_count: number
    phone_number: string
    user: {
        first_name: string
        id: number
        is_active: true
        last_name: string
        username: string
    }
}