import { OrdersByHours, SubrouteDetails } from './orders-by-hours';

export interface DailyUserOrderType {
    orders: OrdersByHours[];
    seat_count_sum: number;
    sub_route: SubrouteDetails;
}
export interface DailyDriverOrderType {
    result: { driver: any, array?: any }[];
    sub_routes: SubrouteDetails[];
}
