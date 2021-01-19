import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SkillsDataRoutingModule } from './skills-data-routing.module';
import { SkillsDataComponent } from './skills-data.component';

@NgModule({
  declarations: [SkillsDataComponent],
  imports: [CommonModule, SkillsDataRoutingModule]
})
export class SkillsDataModule {}
