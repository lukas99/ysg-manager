import { NgModule } from '@angular/core';

import { SkillsOnIceRoutingModule } from './skills-on-ice-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { SkillSelectionComponent } from './skill-selection/skill-selection.component';

@NgModule({
  declarations: [SkillSelectionComponent],
  imports: [SharedModule, SkillsOnIceRoutingModule]
})
export class SkillsOnIceModule {}