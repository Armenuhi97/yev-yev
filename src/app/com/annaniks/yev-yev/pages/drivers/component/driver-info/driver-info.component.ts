import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { CityItem } from '../../../../core/models/city.model';
import { ServerResponce } from '../../../../core/models/server-reponce';
import { AppService } from '../../../../core/services/app.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Messages } from '../../../../core/models/mesages';
import { SalaryRespone } from '../../../../core/models/salary';
import { DriverInfoService } from './driver-info.service';

@Component({
  selector: 'app-driver-info',
  templateUrl: './driver-info.component.html',
  styleUrls: ['./driver-info.component.css']
})
export class DriverInfoComponent implements OnInit {

  public validateForm: FormGroup;
  private id: number = 0;
  public driverDate: any = {};
  cities: CityItem[] = [];
  public activeTab: number = 0;

  constructor(
    private fb: FormBuilder,
    private httpClient: HttpClient,
    private nzMessages: NzMessageService,
    private activeRoute: ActivatedRoute,
    private appService: AppService,
    private driverInfo: DriverInfoService) { }

  ngOnInit(): void {
    this.initForm();
    this.getCities();
    this.getDriverData();
  }


  private initForm(): void {
    this.validateForm = this.fb.group({
      first_name: [null, Validators.required],
      last_name: [this.driverDate.first_name, Validators.required],
      phone_number: [null, Validators.required],
      car_model: [null, Validators.required],
      car_color: [null, Validators.required],
      car_number: [null, Validators.required],
      car_capacity: [null, Validators.required],
      car_color_name_hy: [null, Validators.required],
      car_color_name_en: [null, Validators.required],
      car_color_name_ru: [null, Validators.required],
      main_city_id: [null, Validators.required],
      located_city_id: [null]
    });
  }

  public changeColorPicker(controlName: string, event): void {
    this.validateForm.get(controlName).setValue(event.target.value);
  }

  private getDriverData(): void {
    this.activeRoute.params.pipe(switchMap((rout: any) => {
      this.id = rout.id;
      return this.driverInfo.getDriver(this.id);
    })).subscribe((data: any) => {
      if (data.results && data.results[0]) {
        this.driverDate = data.results[0];
        this.validateForm.patchValue({
          first_name: this.driverDate.user.first_name,
          last_name: this.driverDate.user.last_name,
          phone_number: this.driverDate.phone_number,
          car_model: this.driverDate.car_model,
          car_color: this.driverDate.car_color,
          car_number: this.driverDate.car_number,
          car_capacity: this.driverDate.car_capacity,
          car_color_name_hy: this.driverDate.car_color_name_hy,
          car_color_name_en: this.driverDate.car_color_name_en,
          car_color_name_ru: this.driverDate.car_color_name_ru,
          main_city_id: this.appService.checkPropertyValue(this.driverDate.main_city, 'id'),
          located_city_id: this.appService.checkPropertyValue(this.driverDate.located_city, 'id')
        });
      }
    });
  }

  private getCities(): void {
    this.driverInfo.getCitys()
      .subscribe((data: any) => {
        this.cities = data.results;
      });
  }

  public onChangeTab($event) {
    this.activeTab = $event;
    if (this.activeTab === 2) {
      // this.getRatingResults();
    }
  }

  public getRatingResults(): void {
    // this._httpClient.get(`order/rating/?driver=${this.editId}&order__sub_route=&client=&ordering=&start_date=&end_date=&limit=&offset=&type=`)
    //     .subscribe((res: any) => {
    //         this.userRating = res.results;
    //         this.count = res.count;
    //     });
  }

  public removeRoute($event) {
    //this.addedRoutes.splice($event, 1)
  }

  public submitForm(): void {

    if (this.validateForm.invalid) {
      this.nzMessages.error(Messages.fail);
      return;
    }
    let sendObject: SalaryRespone = Object.assign({}, this.validateForm.value, { image: '' });
    this.driverInfo.getUsers(this.id, sendObject).subscribe(() => {
      this.nzMessages.success(Messages.success);
    }, (error) => {
      let failMessage = Messages.fail;
      if (error && error.error && error.error[0] == 'Viber already in use.') {
        failMessage = Messages.viberError;
      }
      this.nzMessages.error(failMessage);
    });
  }
}
