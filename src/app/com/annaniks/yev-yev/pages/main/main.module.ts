import { NgModule } from "@angular/core";
import { SharedModule } from "../../core/shared/shared.module";
import { MainRoutingModule } from "./main-routing.module";
import { MainComponent } from "./main.component";
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import { ClickOutsideModule } from 'ng-click-outside';

@NgModule({
    declarations: [MainComponent],
    imports: [SharedModule,ClickOutsideModule, MainRoutingModule,MatToolbarModule,MatSidenavModule]
})
export class MainModule { }