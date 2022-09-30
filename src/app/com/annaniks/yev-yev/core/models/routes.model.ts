export interface RouteItem {
    created_at: string
    id: number
    moderator_details: Array<{
        user: number
        user_details: {
            car_capacity: null
            car_color: null
            car_model: null
            car_number: null
            comment: null
            id: number
            image: string
            phone_number: string
            user: { id: number, first_name: string, last_name: string, is_active: boolean, username: string }
            user_role: { id: number, title: string, code: string }
        }
    }>
    route_name: string
}

export interface Counts {
  potential:number;
  potential_on_way:number;
  approved_seat_count:number;
  pending_seat_count:number
}
