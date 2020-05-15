import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TournamentsComponent } from './tournaments.component';

const routes: Routes = [{ path: '', component: TournamentsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TournamentsRoutingModule {}
