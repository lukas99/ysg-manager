import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SkillsDataComponent } from './skills-data.component';

const routes: Routes = [{ path: '', component: SkillsDataComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SkillsDataRoutingModule {}
