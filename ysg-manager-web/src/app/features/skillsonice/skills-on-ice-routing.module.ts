import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkillSelectionComponent } from './skill-selection/skill-selection.component';

const routes: Routes = [{ path: '', component: SkillSelectionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SkillsOnIceRoutingModule {}
