import { NgModule } from "@angular/core";
import { ModeratorSettingsComponent } from "./moderator-settings.component";
import { ModeratorSettingsRoutingModule } from "./moderator-settings.routing.module";

@NgModule({
    declarations: [ModeratorSettingsComponent],
    exports: [ModeratorSettingsRoutingModule]
})
export class ModeratorModule { }
