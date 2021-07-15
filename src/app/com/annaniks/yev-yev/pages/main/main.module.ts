import { NgModule } from "@angular/core";
import { SharedModule } from "../../core/shared/shared.module";
import { MainRoutingModule } from "./main-routing.module";
import { MainComponent } from "./main.component";
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ClickOutsideModule } from 'ng-click-outside';
import { NotificationComponent } from "../../core/components/notification/notification.component";
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
    declarations: [MainComponent, NotificationComponent],
    imports: [SharedModule,InfiniteScrollModule, ClickOutsideModule, MainRoutingModule, MatToolbarModule, MatSidenavModule]
})
export class MainModule { }