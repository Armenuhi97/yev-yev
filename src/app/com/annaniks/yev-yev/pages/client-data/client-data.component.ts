import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { switchMap, takeUntil } from 'rxjs/operators';
import { NzMessageService } from "ng-zorro-antd/message";
import { Messages } from '../../core/models/mesages';
import { UsersService } from '../users/users.service';
import { Subject } from 'rxjs';
import { ServerResponce } from '../../core/models/server-reponce';

@Component({
  selector: 'app-client-data',
  templateUrl: './client-data.component.html',
  styleUrls: ['./client-data.component.css']
})
export class ClientDataComponent implements OnInit {
  public validateForm: FormGroup;
  public clientId: number = 0;
  public clientRating: any = [];
  public count: number = 0;
  userName: string = '';
  activeTab: number = 0;

  orders: any[] = [];
  total: number = 0;
  unsubscribe$ = new Subject();
  pageIndex: number = 1;
  constructor(
    private fb: FormBuilder,
    private activeRoute: ActivatedRoute,
    private nzMessages: NzMessageService,
    private userService: UsersService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.getClientData();
  }

  private initForm() {
    this.validateForm = this.fb.group({
      first_name: [null, Validators.required],
      last_name: [null, Validators.required],
      phone_number: [null, Validators.required],
      comment: [null]
    })
  }

  public getClientData() {
    this.activeRoute.params
      .pipe(switchMap((rout: any) => {
        this.clientId = rout.id;
        return this.userService.getUserById(this.clientId);
      })).subscribe((data: any) => {
        if (data.results && data.results[0]) {
          let item = data.results[0];
          this.userName = `${item.user.first_name} ${item.user.last_name}`
          this.validateForm.patchValue({
            first_name: item.user.first_name,
            last_name: item.user.last_name,
            phone_number: item.phone_number,
            comment: item.comment
          });
        }
      });
  }

  public submitForm() {
    if (this.validateForm.invalid) {
      this.nzMessages.error(Messages.fail);
      return;
    }
    let sendObject = {
      "first_name": this.validateForm.get('first_name').value,
      "last_name": this.validateForm.get('last_name').value,
      "phone_number": this.validateForm.get('phone_number').value,
      "image": '',
      "comment": this.validateForm.get('comment').value ? this.validateForm.get('comment').value : '',
    };
    this.userService.editUser(this.clientId, sendObject).subscribe();
  }

  public getRatingResults(): void {
    this.userService.getRating(this.clientId)
      .subscribe((res: any) => {
        this.clientRating = res.results;
        this.count = res.count;
      });
  }


  private getOrdrs(): void {
    this.userService.getOrders(this.clientId, this.pageIndex)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: ServerResponce<any[]>) => {
        this.total = data.count;
        this.orders = data.results;
      });
  }

  public onChangeTab($event): void {
    this.activeTab = $event;
    if (this.activeTab === 1) {
       this.getOrdrs();
    }

    if (this.activeTab === 2) {

      this.getRatingResults();
    }
  }


}
