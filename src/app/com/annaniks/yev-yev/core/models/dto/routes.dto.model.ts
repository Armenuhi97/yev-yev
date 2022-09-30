export class CountDto {
  public sub_route_id: number;
  public sub_route_second_id: number;
  public date: string;
  public main_route_id: number;

  constructor(subRouteId: number, subRouteSecondId: number, date: string, mainRouteId: number) {
    this.sub_route_id = subRouteId;
    this.sub_route_second_id = subRouteSecondId;
    this.date = date;
    this.main_route_id = mainRouteId
  }
}
