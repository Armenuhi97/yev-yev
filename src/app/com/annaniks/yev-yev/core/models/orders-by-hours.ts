export interface OrdersByHours {
    address: string
    isSelect?: boolean
    is_in_approved_orders:boolean
    end_address: null
    end_langitude: string
    end_latitude: string
    phone_number: string
    start_address: string
    start_langitude: string
    start_latitude: string
    order_phone_number:string
    client_details: {
        car_capacity: string
        car_color: string
        car_model: string
        car_number: string
        comment: string
        has_moderating_permission: boolean
        id: number
        image: string
        phone_number: string
        user: {
            first_name: string
            id: number
            is_active: boolean
            last_name: string
            username: string
        }
        user_role: { id: number, title: string, code: string }
    }
    comment: string
    date: string
    id: number
    langitude: null
    latitude: null
    order_type: number
    order_type_details: {
        id: number
        name_en: string
        name_hy: string
        name_ru: string
    }
    person_count: number
    status: string
    sub_route: number
    sub_route_details: SubrouteDetails
    user: number
}
export interface SubrouteDetails {
    countList?: any
    end_point: number
    end_point_address_en: string
    end_point_address_hy: string
    end_point_address_ru: string
    end_point_city: { id: number, name_hy: string, name_ru: string, name_en: string }
    end_point_is_static: boolean
    id: number
    main_route: number
    main_route_name: string
    start_point: number
    start_point_address_en: string
    start_point_address_hy: string
    start_point_address_ru: string
    start_point_city: { id: number, name_hy: string, name_ru: string, name_en: string }
    start_point_is_static: boolean
}