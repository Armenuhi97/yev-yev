import { User } from "../../../core/models/salary";

export interface AddressFilterModel {
    start_date: string;
    end_date: string;
    address: string;
    route_id: number;
    limit: number;
    offset: number;
    page: number;
}
export class AddressModel {
    canceled_by_client: boolean;
    canceled_by_moderator: boolean;
    comment: string | null;
    date: string;
    date_has_changed: boolean;
    end_address: string;
    end_langitude: string;
    end_latitude: string;
    extra_order_id: null
    has_rate: boolean;
    id: number;
    is_extra_order: boolean;
    is_free: boolean;
    last_date: null
    moderated_by_admin: boolean;
    order_type: number;
    person_count: number;
    phone_number: string;
    rating: null
    skipped: boolean;
    start_address: string;
    start_langitude: string;
    start_latitude: string;
    status: string;
    sub_route: number;
    user: User;
}