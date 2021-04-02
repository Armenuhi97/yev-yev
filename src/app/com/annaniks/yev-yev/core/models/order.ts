export interface OrderResponse {
    "sub_route": number,
    "date": string
    "person_count": number,
    "start_address": string
    "start_langitude": string
    "start_latitude": string
    "end_address": string
    "end_langitude": string
    "end_latitude": string
    "user": number,
    "first_name": string
    "last_name": string
    "phone_number": string
    "order_phone_number": string
    "order_type": number,
    "comment": string,
    user_comment:string
    status:string
    is_free:boolean
}