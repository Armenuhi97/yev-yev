import { SubrouteDetails } from "./orders-by-hours";

export interface Notification extends ExtraOrderNotification {

    created_at: string;
    id: number;
    is_seen: boolean;
    order: number;
    order_details: OrderDetails;
    main_route: number;
    main_route_name: string;
    type: string;
    user: number;
}
export interface ExtraOrderNotification {
    connected_order_details: OrderDetails;
}
export interface OrderDetails {
    comment: string | null;
    date: string;
    end_address: string;
    end_langitude: string;
    end_latitude: string;
    id: number;
    is_in_approved_orders: boolean;
    order_type: number;
    person_count: number;
    phone_number: string;
    start_address: string;
    start_langitude: string;
    start_latitude: string;
    status: string;
    sub_route: number;
    sub_route_details: SubrouteDetails;
    user: number;
}
export interface PendingNotification {
    extra_orders: Notification[];
    orders: Notification[];
}