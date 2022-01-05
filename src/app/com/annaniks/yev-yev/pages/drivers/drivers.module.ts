import { NgModule } from "@angular/core";
import { SharedModule } from "../../core/shared/shared.module";
import { DriverService } from "./drivers.service";
import { DriversRoutingModule } from "./drivers-routing.module";
import { DriversComponent } from "./drivers.component";
import { ColorPickerModule } from 'ngx-color-picker';
import { RoutesListComponent, DriverRoutesComponent } from "./component";
import { RatingComponent } from './component/rating/rating.component';
import { DriverInfoModule } from "./component/driver-info/driver-info.module";

@NgModule({
    declarations: [DriversComponent, RoutesListComponent, RatingComponent, DriverRoutesComponent],
    imports: [SharedModule, ColorPickerModule, DriversRoutingModule, DriverInfoModule],
    providers: [DriverService],
})
export class DriverModule { }