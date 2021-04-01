import { NgModule } from "@angular/core";
import { SharedModule } from "../../core/shared/shared.module";
import { ModeratorSettingsComponent } from "./moderator-settings.component";
import { ModeratorSettingsRoutingModule } from "./moderator-settings.routing.module";
import { ModeratorSettingsService } from "./moderator-settings․service";

@NgModule({
    declarations: [ModeratorSettingsComponent],
    imports: [ModeratorSettingsRoutingModule,SharedModule],
    providers:[ModeratorSettingsService]
})
export class ModeratorSettingsModule { }
