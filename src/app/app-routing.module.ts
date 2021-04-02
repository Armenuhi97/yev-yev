import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./com/annaniks/yev-yev/core/guards/auth.duard";
const appRoutes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    { path: 'auth', loadChildren: () => import('./com/annaniks/yev-yev/pages/auth/auth.module').then((m) => m.AuthModule) },
    { path: 'dashboard',  loadChildren: () => import('./com/annaniks/yev-yev/pages/main/main.module').then(m => m.MainModule),canActivate: [AuthGuard], }

]
@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }