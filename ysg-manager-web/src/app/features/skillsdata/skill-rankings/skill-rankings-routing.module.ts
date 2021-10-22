import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkillRankingListComponent } from './skill-ranking-list/skill-ranking-list.component';

const routes: Routes = [{ path: '', component: SkillRankingListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SkillRankingsRoutingModule {}
