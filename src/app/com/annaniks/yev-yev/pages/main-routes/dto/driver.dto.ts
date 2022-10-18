export class AvailableDriversDto {
    sub_route_id: number;
    main_route_id: number;
    date: string;
    constructor(data) {
        this.sub_route_id = data.sub_route_id;
        this.main_route_id = data.main_route_id;
        this.date = data.date;
    }
}