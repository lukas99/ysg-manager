import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkillResultListComponent } from './skill-result-list/skill-result-list.component';
import { SkillResultDetailComponent } from './skill-result-detail/skill-result-detail.component';

const routes: Routes = [
  { path: '', component: SkillResultListComponent },
  { path: 'detail', component: SkillResultDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SkillResultsRoutingModule {}
