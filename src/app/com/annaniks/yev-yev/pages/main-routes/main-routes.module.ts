import { NgModule } from "@angular/core";
import { MainRoutesRoutingModule } from "./main-routes-routing.module";
import { MainRoutesComponent } from "./main-routes.component";
import { SharedModule } from "../../core/shared/shared.module";
import { MainRoutesService } from "./main-routes.service";
import { SubrouteComponent } from "./component/subroute/subroute.component";
import { ClickOutsideModule } from 'ng-click-outside';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { AddClientFormComponent } from './component/add-client-form/add-client-form.component';
import { WeekDayPipe } from './pipes/week-day.pipe';

@NgModule({
    declarations: [MainRoutesComponent, SubrouteComponent, AddClientFormComponent, WeekDayPipe],
    imports: [MainRoutesRoutingModule, SharedModule, ClickOutsideModule, NzSwitchModule],
    providers: [MainRoutesService]
})
export class MainRoutesModule { }
