import { NgModule } from "@angular/core";
import { SharedModule } from "../../core/shared/shared.module";
import { OtherRoutesTimes,RoutesComponent,CityComponent,PhoneComponent } from "./components";
import { SettingsService } from "./setting.service";
import { SettingsRoutingModule } from "./settings-routing.module";
import { SettingsComponent } from "./settings.component";

@NgModule({
    declarations: [SettingsComponent,RoutesComponent,CityComponent,PhoneComponent,OtherRoutesTimes],
    imports: [SettingsRoutingModule, SharedModule],
    providers: [SettingsService]
})
export class SettingsModule { }