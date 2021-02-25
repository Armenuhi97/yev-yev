import { NgModule } from "@angular/core";
import { SharedModule } from "../../core/shared/shared.module";
import { DriverService } from "./drivers.service";
import { DriversRoutingModule } from "./drivers-routing.module";
import { DriversComponent } from "./drivers.component";
import { ColorPickerModule } from 'ngx-color-picker';
import { DriverRoutesComponent } from "./component/driver-routes/driver-routes.component";

@NgModule({
    declarations: [DriversComponent, DriverRoutesComponent],
    imports: [SharedModule, ColorPickerModule, DriversRoutingModule],
    providers: [DriverService]
})
export class DriverModule { }