import { NgModule } from "@angular/core";
import { SharedModule } from "../../core/shared/shared.module";
import { OtherRoutesTimes, RoutesComponent, CityComponent, PhoneComponent, RatesComponent } from "./components";
import { SettingsService } from "./setting.service";
import { SettingsRoutingModule } from "./settings-routing.module";
import { SettingsComponent } from "./settings.component";
import { DailyPriceComponent } from "./components/daily-price/daily-price.component";

@NgModule({
    declarations: [SettingsComponent, RoutesComponent, CityComponent, PhoneComponent, RatesComponent, OtherRoutesTimes, DailyPriceComponent],
    imports: [SettingsRoutingModule, SharedModule],
    providers: [SettingsService]
})
export class SettingsModule { }