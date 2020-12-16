import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MasterdataComponent } from './masterdata.component';

const routes: Routes = [
  {
    path: '',
    component: MasterdataComponent,
    children: [
      {
        path: 'tournaments',
        loadChildren: () =>
          import('./tournaments/tournaments.module').then(
            (m) => m.TournamentsModule
          )
      },
      {
        path: 'teams',
        loadChildren: () =>
          import('./teams/teams.module').then((m) => m.TeamsModule)
      },
      {
        path: 'players',
        loadChildren: () =>
          import('./players/players.module').then((m) => m.PlayersModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterdataRoutingModule {}
