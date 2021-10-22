import { NgModule } from '@angular/core';

import { SkillRankingsRoutingModule } from './skill-rankings-routing.module';
import { SkillRankingListComponent } from './skill-ranking-list/skill-ranking-list.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [SkillRankingListComponent],
  imports: [SharedModule, SkillRankingsRoutingModule]
})
export class SkillRankingsModule {}
