export class ChangeStatusDto {
    comment: string;
    sub_route: number;
    date: string;
    person_count: number;
    start_address: string;
    start_langitude: string;
    start_latitude: string;
    end_address: string;
    end_langitude: string;
    end_latitude: string;
    is_free: boolean;
    is_extra_order: boolean;
    user: number;
    order_phone_number: string | null;
    order_type: any;
    is_admin: boolean;
    change_status: boolean;
    constructor(data, subrouteId: number, date) {
        this.comment = data.comment;
        this.sub_route = subrouteId;
        this.date = date;
        this.person_count = data.person_count;
        this.start_address = data.start_address;
        this.start_langitude = '';
        this.start_latitude = '';
        this.end_address = data.end_address;
        this.end_langitude = '';
        this.end_latitude = '';
        this.is_free = data.is_free || false;
        this.is_extra_order = data.is_extra_order || false;
        this.user = data.user ? data.user : null;
        this.order_phone_number = data.phone_number;
        this.order_type = data.order_type;
        this.is_admin = true;
        this.change_status = true;
    }

}