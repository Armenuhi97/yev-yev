export class CountDto {
  public sub_route_id: number;
  public sub_route_second_id: number;
  public date: string;

  constructor(subRouteId: number, subRouteSecondId: number, date: string) {
    this.sub_route_id = subRouteId
    this.sub_route_second_id = subRouteSecondId
    this.date = date

  }
}
