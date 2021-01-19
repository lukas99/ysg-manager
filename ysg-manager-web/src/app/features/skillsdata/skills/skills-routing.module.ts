import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkillListComponent } from './skill-list/skill-list.component';
import { SkillDetailComponent } from './skill-detail/skill-detail.component';

const routes: Routes = [
  { path: '', component: SkillListComponent },
  { path: 'detail', component: SkillDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SkillsRoutingModule {}
