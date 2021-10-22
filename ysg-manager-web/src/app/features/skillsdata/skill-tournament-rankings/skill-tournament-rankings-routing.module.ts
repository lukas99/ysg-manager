import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SkillTournamentRankingListComponent } from './skill-tournament-ranking-list/skill-tournament-ranking-list.component';

const routes: Routes = [
  { path: '', component: SkillTournamentRankingListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SkillTournamentRankingsRoutingModule {}
