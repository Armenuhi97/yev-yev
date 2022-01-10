import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { RatingOrderServiceService } from './rating-order-service.service';

@Component({
  selector: 'app-rating-order',
  templateUrl: './rating-order.component.html',
  styleUrls: ['./rating-order.component.css']
})
export class RatingOrderComponent implements OnInit {

  public total: number = 10;
  public pageSize: number = 10;
  public pageIndex: number = 1;


  public appovedItems: any = {};
  public id: number = 0;
  constructor(private routerActive: ActivatedRoute, private appovedService: RatingOrderServiceService) { }


  ngOnInit(): void {
    this.getActiveOrder();
  }

  private getActiveOrder(): void {

    this.routerActive.params.pipe(switchMap((params: { [key: string]: number }) => {
      this.id = params.id;
      return this.appovedService.getAppovedOrder(this.id);
    })).subscribe((res: any) => {
      this.appovedItems = res;
    });

  }

}
