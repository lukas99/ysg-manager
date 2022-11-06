import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkillSelectionComponent } from './skill-selection/skill-selection.component';
import { TeamSelectionComponent } from './team-selection/team-selection.component';
import { RatingListComponent } from './skill-ratings/rating-list.component';
import { ResultListComponent } from './skill-results/result-list.component';
import { ResultDetailForTimeComponent } from './skill-results/result-detail-for-time.component';

const routes: Routes = [
  { path: '', component: SkillSelectionComponent },
  { path: 'teamselection', component: TeamSelectionComponent },
  { path: 'resultlist', component: ResultListComponent },
  { path: 'resultdetailfortime', component: ResultDetailForTimeComponent },
  { path: 'ratinglist', component: RatingListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SkillsOnIceRoutingModule {}
