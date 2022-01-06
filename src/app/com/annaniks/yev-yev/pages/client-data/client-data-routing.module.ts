import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientDataComponent } from './client-data.component';

const ratingRoutes: Routes = [{ path: '', component: ClientDataComponent }];

@NgModule({
  imports: [RouterModule.forChild(ratingRoutes)],
  exports: [RouterModule]
})
export class ClientDataRoutingModule { }
