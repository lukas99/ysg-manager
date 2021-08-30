import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkillRatingListComponent } from './skill-rating-list/skill-rating-list.component';
import { SkillRatingDetailComponent } from './skill-rating-detail/skill-rating-detail.component';

const routes: Routes = [
  { path: '', component: SkillRatingListComponent },
  { path: 'detail', component: SkillRatingDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SkillRatingsRoutingModule {}
