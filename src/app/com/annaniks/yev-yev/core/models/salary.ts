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

    "id": number,
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
    "car_model": null,
    "car_color": null,
    "car_number": null,
    "car_capacity": null,
    "comment": null,
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