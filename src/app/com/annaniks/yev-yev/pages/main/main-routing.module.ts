import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MainComponent } from "./main.component";
const mainRoutes: Routes = [{
    path: '', component: MainComponent,
    children: [
        { path: "", redirectTo: "driver", pathMatch: "full" },
        { path: 'settings', loadChildren: () => import('../settings/settings.module').then((m) => m.SettingsModule) },
        { path: 'rating', loadChildren: () => import('../review/review.module').then((m) => m.ReviewngModule) },
        { path: 'raiting-order/:id', loadChildren: () => import('../rating-order/rating-order.module').then((m) => m.RatingOrderModule) },
        { path: 'driver-info/:id', loadChildren: () => import('../driver-data/driver-data.module').then((m) => m.DriverDataModule) },

        { path: 'client-info/:id', loadChildren: () => import('../client-data/client-data.module').then((m) => m.ClientDataModule)},

        { path: 'star', loadChildren: () => import('../star/star.module').then((m) => m.StarModule) },
        { path: 'moderator', loadChildren: () => import("../salaries/salaries.module").then((m => m.SalariesModule)) },
        { path: 'driver', loadChildren: () => import("../drivers/drivers.module").then((m => m.DriverModule)) },
        { path: 'user', loadChildren: () => import("../users/users.module").then((m => m.UsersModule)) },
        { path: 'main-routes', loadChildren: () => import("../main-routes/main-routes.module").then((m => m.MainRoutesModule)) },
        { path: 'orders', loadChildren: () => import("../orders/orders.module").then((m => m.OrdersModule)) },
        { path: 'other-orders', loadChildren: () => import("../other-orders/other-orders.module").then((m => m.otherOrdersModule)) },
        { path: 'moderator-settings', loadChildren: () => import("../moderator-settings/moderator-settings.module").then(m => m.ModeratorSettingsModule) }
    ]
}];
@NgModule({
    imports: [RouterModule.forChild(mainRoutes)],
    exports: [RouterModule]
})
export class MainRoutingModule { }
