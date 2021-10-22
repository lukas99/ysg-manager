import { NgModule } from '@angular/core';

import { SkillTournamentRankingsRoutingModule } from './skill-tournament-rankings-routing.module';
import { SkillTournamentRankingListComponent } from './skill-tournament-ranking-list/skill-tournament-ranking-list.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [SkillTournamentRankingListComponent],
  imports: [SharedModule, SkillTournamentRankingsRoutingModule]
})
export class SkillTournamentRankingsModule {}
