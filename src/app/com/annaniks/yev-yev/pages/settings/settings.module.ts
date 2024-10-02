import { NgModule } from "@angular/core";
import { SharedModule } from "../../core/shared/shared.module";
import { OtherRoutesTimes, RoutesComponent, CityComponent, PhoneComponent, RoutePricesComponent, SeatsPriceComponent } from "./components";
import { SettingsService } from "./setting.service";
import { SettingsRoutingModule } from "./settings-routing.module";
import { SettingsComponent } from "./settings.component";

@NgModule({
    declarations: [
        SettingsComponent,
        RoutesComponent,
        CityComponent,
        PhoneComponent,
        OtherRoutesTimes,
        RoutePricesComponent,
        SeatsPriceComponent
    ],
    imports: [SettingsRoutingModule, SharedModule

    ],
    providers: []
})
export class SettingsModule { }