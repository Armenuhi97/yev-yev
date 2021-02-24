export interface SalaryRespone {
    "first_name": string
    "last_name": string
    "phone_number": string
    "image": string
    "username": string
}
export interface User{
    
        "id": number,
        "user": {
            "id": number,
            "first_name":string
            "last_name":string
            "is_active": true
            username:string
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