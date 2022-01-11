import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { switchMap, takeUntil } from 'rxjs/operators';
import { CityItem } from '../../core/models/city.model';
import { AppService } from '../../core/services/app.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Messages } from '../../core/models/mesages';
import { SalaryRespone } from '../../core/models/salary';
import { DriverService } from '../drivers/drivers.service';
import { Subject } from 'rxjs';
import { ServerResponce } from '../../core/models/server-reponce';



@Component({
  selector: 'app-driver-data',
  templateUrl: './driver-data.component.html',
  styleUrls: ['./driver-data.component.css']
})
export class DriverDataComponent implements OnInit {


  public validateForm: FormGroup;
  public id: number = 0;
  public driverDate: any = {};
  public cities: CityItem[] = [];
  public activeTab: number = 0;
  public routes: [] = [];
  public userRating: any[] = [];
  public count: number = 0;

  pageIndex: number = 1;
  unsubscribe$ = new Subject();
  total: number = 0;
  orders: any[] = [];
  constructor(
    private fb: FormBuilder,
    private nzMessages: NzMessageService,
    private activeRoute: ActivatedRoute,
    private appService: AppService,
    private driverService: DriverService) { }


  ngOnInit(): void {
    this.initForm();
    this.getCities();
    this.getDriverData();
    this.getRoutes();
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
      return this.driverService.getUserById(this.id);
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
    this.driverService.getAllCities()
      .subscribe((data: any) => {
        this.cities = data.results;
      });
  }

  private getRoutes(): void {
    this.driverService.getAllRoutes().subscribe((res: any) => {
      this.routes = res.results;
    })
  }

  public getOrders() {
    this.driverService.getOrders(this.id, this.pageIndex)
      .pipe(takeUntil(this.unsubscribe$)).subscribe((data: ServerResponce<any[]>) => {
        this.total = data.count;
        this.orders = data.results;
      });
  }

  public onChangeTab($event) {
    this.activeTab = $event;
    if (this.activeTab === 1) {
        this.getOrders();
    }
    if (this.activeTab === 2) {
      this.getRatingResults();
    }
  }

  public getRatingResults(): void {
    this.driverService.getRating(this.id)
      .subscribe((res: any) => {
        this.userRating = res.results;
        this.count = res.count;
      });
  }


  public submitForm(): void {

    if (this.validateForm.invalid) {
      this.nzMessages.error(Messages.fail);
      return;
    }
    let sendObject: SalaryRespone = Object.assign({}, this.validateForm.value, { image: '' });

    this.driverService.editUser(this.id, sendObject)
      .subscribe(() => {
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
