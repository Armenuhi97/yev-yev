import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MainComponent } from "./main.component";
const mainRoutes: Routes = [{
    path: '', component: MainComponent,
    children: [
        { path: "", redirectTo: "settings", pathMatch: "full" },
        { path: 'settings', loadChildren: () => import('../settings/settings.module').then((m) => m.SettingsModule) },
        { path: 'salary', loadChildren: () => import("../salaries/salaries.module").then((m => m.SalariesModule)) }

    ]
}];
@NgModule({
    imports: [RouterModule.forChild(mainRoutes)],
    exports: [RouterModule]
})
export class MainRoutingModule { }
