import { NgModule } from "@angular/core";
import { MainRoutesRoutingModule } from "./main-routes-routing.module";
import { MainRoutesComponent } from "./main-routes.component";
import { SharedModule } from "../../core/shared/shared.module";
import { MainRoutesService } from "./main-routes.service";
import { SubrouteComponent } from "./component/subroute/subroute.component";
import { ClickOutsideModule } from 'ng-click-outside';

@NgModule({
    declarations: [MainRoutesComponent,SubrouteComponent],
    imports: [MainRoutesRoutingModule, SharedModule,ClickOutsideModule],
    providers: [MainRoutesService]
})
export class MainRoutesModule { }