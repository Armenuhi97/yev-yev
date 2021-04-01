import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ModeratorSettingsComponent } from "./moderator-settings.component";
const routes: Routes = [{ path: '', component: ModeratorSettingsComponent }]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ModeratorSettingsRoutingModule { }