import { NgModule } from '@angular/core';

import { SkillsRoutingModule } from './skills-routing.module';
import { SkillListComponent } from './skill-list/skill-list.component';
import { SkillDetailComponent } from './skill-detail/skill-detail.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [SkillListComponent, SkillDetailComponent],
  imports: [SharedModule, SkillsRoutingModule]
})
export class SkillsModule {}
