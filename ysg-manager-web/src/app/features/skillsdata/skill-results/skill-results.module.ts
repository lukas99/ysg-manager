import { NgModule } from '@angular/core';

import { SkillResultsRoutingModule } from './skill-results-routing.module';
import { SkillResultListComponent } from './skill-result-list/skill-result-list.component';
import { SkillResultDetailComponent } from './skill-result-detail/skill-result-detail.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [SkillResultListComponent, SkillResultDetailComponent],
  imports: [SharedModule, SkillResultsRoutingModule]
})
export class SkillResultsModule {}
