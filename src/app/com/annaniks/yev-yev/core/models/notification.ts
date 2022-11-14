import { SubrouteDetails } from "./orders-by-hours";

export interface Notification {

    created_at: string;
    id: number;
    is_seen: boolean;
    order: number;
    order_details: {
        comment: null
        date: string
        end_address: string
        end_langitude: string
        end_latitude: string
        id: number
        is_in_approved_orders: false
        order_type: number
        person_count: number
        phone_number: string
        start_address: string
        start_langitude: string
        start_latitude: string
        status: string
        sub_route: number
        sub_route_details: SubrouteDetails,
        user: number
    }
    main_route: number;
    main_route_name: string;
    type: string;
    user: number;
}
export interface PendingNotification {
    extra_orders: any[];
    orders: Notification[];
}