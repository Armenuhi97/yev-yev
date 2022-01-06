import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { NzMessageService } from "ng-zorro-antd/message";
import { Messages } from '../../core/models/mesages';
import { UsersService } from '../users/users.service';

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
}
