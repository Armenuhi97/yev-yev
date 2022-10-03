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

export class AddPassangerDto {
  public first_name: string
  public last_name: string
  public user_comment: string
  public is_free
  public is_extra_order
  public phone_number: string
  public comment: string
  public sub_route: number
  public date
  public person_count
  public start_address
  public start_langitude = ''
  public start_latitude = ''
  public end_address
  public end_langitude = ''
  public end_latitude = ''
  public user: number | null
  public order_phone_number: string | null
  public order_type
  public time: string | null
  public status

  constructor(isFirst: boolean, formValue, subRouteId: number, date, user: number | null) {
    this.sub_route = subRouteId
    this.user = user
    this.date = date
    this.status
    if (isFirst) {
      this.first_name = formValue.first_name
      this.last_name = formValue.last_name
      this.user_comment = formValue.userComment
      this.is_free = formValue.isFree
      this.is_extra_order = formValue.isExtra
      this.phone_number = '+374' + formValue.phone_number
      this.comment = formValue.comment
      this.person_count = formValue.personCount
      this.start_address = formValue.startPointAddress
      this.end_address = formValue.endPointAddress
      this.order_phone_number = formValue.order_phone_number ? '+374' + formValue.order_phone_number : null
      this.order_type = formValue.orderType
      this.time = null
    }
    else{
      this.first_name = formValue.first_nameTwo
      this.last_name = formValue.last_nameTwo
      this.user_comment = formValue.userCommentTwo
      this.is_free = formValue.isFreeTwo
      this.is_extra_order = formValue.isExtraTwo
      this.phone_number = '+374' + formValue.phone_numberTwo
      this.comment = formValue.commentTwo
      this.person_count = formValue.personCountTwo
      this.start_address = formValue.startPointAddressTwo
      this.end_address = formValue.endPointAddressTwo
      this.order_phone_number = formValue.order_phone_numberTwo ? '+374' + formValue.order_phone_numberTwo : null
      this.order_type = formValue.orderTypeTwo
      this.time = formValue.timeTwo
    }
  }
}
