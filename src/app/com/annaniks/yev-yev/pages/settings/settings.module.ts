import { NgModule } from "@angular/core";
import { SharedModule } from "../../core/shared/shared.module";
import { CityComponent } from "./components/city/city.component";
import { PhoneComponent } from "./components/phone/phone.component";
import { RoutesComponent } from "./components/routes/routes.component";
import { SettingsService } from "./setting.service";
import { SettingsRoutingModule } from "./settings-routing.module";
import { SettingsComponent } from "./settings.component";

@NgModule({
    declarations: [SettingsComponent,RoutesComponent,CityComponent,PhoneComponent],
    imports: [SettingsRoutingModule, SharedModule],
    providers: [SettingsService]
})
export class SettingsModule { }