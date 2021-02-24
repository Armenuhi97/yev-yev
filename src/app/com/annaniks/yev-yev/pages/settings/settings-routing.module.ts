import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SettingsComponent } from "./settings.component";
const settingsRoutes = [{ path: '', component: SettingsComponent }]
@NgModule({
    imports: [RouterModule.forChild(settingsRoutes)],
    exports: [RouterModule]
})
export class SettingsRoutingModule { }