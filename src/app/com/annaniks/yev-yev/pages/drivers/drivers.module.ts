import { NgModule } from "@angular/core";
import { SharedModule } from "../../core/shared/shared.module";
import { DriverService } from "./drivers.service";
import { DriversRoutingModule } from "./drivers-routing.module";
import { DriversComponent } from "./drivers.component";
import { ColorPickerModule } from 'ngx-color-picker';
import { RoutesListComponent, DriverRoutesComponent } from "./component";
import { RatingComponent } from './component/rating/rating.component';
import { ChangeHolidayDateComponent } from './component/change-holiday-date/change-holiday-date.component';


@NgModule({
    declarations: [DriversComponent, RoutesListComponent, RatingComponent, DriverRoutesComponent, ChangeHolidayDateComponent],
    imports: [SharedModule, ColorPickerModule, DriversRoutingModule],
    providers: [DriverService],
    exports: [DriverRoutesComponent, RoutesListComponent, RatingComponent]
})
export class DriverModule { }