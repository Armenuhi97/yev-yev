import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MainComponent } from "./main.component";
const mainRoutes: Routes = [{
    path: '', component: MainComponent,
    children: [
        { path: "", redirectTo: "settings", pathMatch: "full" },
        { path: 'settings', loadChildren: () => import('../settings/settings.module').then((m) => m.SettingsModule) },
        { path: 'moderator', loadChildren: () => import("../salaries/salaries.module").then((m => m.SalariesModule)) },
        { path: 'driver', loadChildren: () => import("../drivers/drivers.module").then((m => m.DriverModule)) },
        { path: 'user', loadChildren: () => import("../users/users.module").then((m => m.UsersModule)) },
        { path: 'main-routes', loadChildren: () => import("../main-routes/main-routes.module").then((m => m.MainRoutesModule)) }
    ]
}];
@NgModule({
    imports: [RouterModule.forChild(mainRoutes)],
    exports: [RouterModule]
})
export class MainRoutingModule { }
