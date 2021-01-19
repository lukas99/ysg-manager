import { NgModule } from '@angular/core';

import { SkillsDataRoutingModule } from './skills-data-routing.module';
import { SkillsDataComponent } from './skills-data.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [SkillsDataComponent],
  imports: [SharedModule, SkillsDataRoutingModule]
})
export class SkillsDataModule {}
