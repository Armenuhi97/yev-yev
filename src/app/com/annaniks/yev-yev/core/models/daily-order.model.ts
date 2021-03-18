import { OrdersByHours, SubrouteDetails } from "./orders-by-hours";

export interface DailyUserOrderType {
    orders: OrdersByHours[],
    sub_route: SubrouteDetails
}
export interface DailyDriverOrderType {
    result: Array<{ driver: Object}>,
    sub_routes: SubrouteDetails[]
}
