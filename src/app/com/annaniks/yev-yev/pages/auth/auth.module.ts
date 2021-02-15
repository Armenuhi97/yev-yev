import { NgModule } from "@angular/core";
import { SharedModule } from "../../core/shared/shared.module";
import { AuthRoutingModule } from "./auth-routing.module";
import { AuthComponent } from "./auth.component";

@NgModule({
    declarations: [AuthComponent],
    imports: [AuthRoutingModule, SharedModule]
})
export class AuthModule { }