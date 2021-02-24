import { NgModule } from "@angular/core";
import { SharedModule } from "../../core/shared/shared.module";
import { AuthRoutingModule } from "./auth-routing.module";
import { AuthComponent } from "./auth.component";
import { AuthService } from "./auth.service";

@NgModule({
    declarations: [AuthComponent],
    imports: [AuthRoutingModule, SharedModule],
    providers:[AuthService]
})
export class AuthModule { }