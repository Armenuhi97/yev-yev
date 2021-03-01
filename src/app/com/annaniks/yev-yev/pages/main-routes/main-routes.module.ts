import { NgModule } from "@angular/core";
import { MainRoutesRoutingModule } from "./main-routes-routing.module";
import { MainRoutesComponent } from "./main-routes.component";
import { SharedModule } from "../../core/shared/shared.module";
import { MainRoutesService } from "./main-routes.service";
import { SubrouteComponent } from "./component/subroute/subroute.component";

@NgModule({
    declarations: [MainRoutesComponent,SubrouteComponent],
    imports: [MainRoutesRoutingModule, SharedModule],
    providers: [MainRoutesService]
})
export class MainRoutesModule { }