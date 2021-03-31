import { SubrouteDetails } from "./orders-by-hours";

export interface ExtraOrders {
    "id": number,
    "start_point_address": string,
    "start_lang": string,
    "start_lat": string,
    "end_point_address": string,
    "end_lang": string,
    "end_lat": string,
    "person_count": number,
    "date": string,
    "status": string,
    "comment": null,
    "user": number,
    "connected_order": number,
    "connected_order_details": {
        "id": number,
        "sub_route": number,
        "sub_route_details": SubrouteDetails,
        "user": number,
        "start_langitude": string,
        "start_latitude": string,
        "start_address": string,
        "end_langitude": string,
        "end_latitude": string,
        "end_address": string,
        "client_details": {
            "id": number,
            "user": {
                "id": number,
                "first_name": string,
                "last_name": string,
                "is_active": true,
                "username": string
            },
            "user_role": {
                "id": number,
                "title": string,
                "code": string
            },
            "phone_number": string,
            "image": "",
            "car_model": null,
            "car_color": null,
            "car_color_name": null,
            "car_number": null,
            "car_capacity": null,
            "comment": null,
            "has_moderating_permission": boolean,
            "viber_id": null,
            "order_count": number
        },
        "person_count": number,
        "order_type": number,
        "date": string,
        "status": string,
        "comment": string,
        "phone_number": string,
        "canceled_by_client": boolean
        "canceled_by_moderator": boolean
        "is_extra_order": boolean
        "moderated_by_admin": boolean
        "is_in_approved_orders": boolean
    }
}