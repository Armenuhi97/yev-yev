import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StarComponent } from './star.component';


const ratingRoutes: Routes = [{ path: '', component: StarComponent }];

@NgModule({

  imports: [RouterModule.forChild(ratingRoutes)],
  exports: [RouterModule]
})
export class StarRouterModule { }
