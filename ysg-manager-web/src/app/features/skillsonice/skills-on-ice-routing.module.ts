import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkillSelectionComponent } from './skill-selection/skill-selection.component';
import { TeamSelectionComponent } from './team-selection/team-selection.component';
import { RatingListComponent } from './skill-ratings/rating-list.component';
import { ResultListComponent } from './skill-results/result-list.component';
import { ResultDetailForTimeComponent } from './skill-results/result-detail-for-time.component';
import { ResultDetailForTimeWithPointsComponent } from './skill-results/result-detail-for-time-with-points.component';
import { ResultDetailForPointsComponent } from './skill-results/result-detail-for-points.component';
import { ResultDetailForTimeManualComponent } from './skill-results/result-detail-for-time-manual.component';

const routes: Routes = [
  { path: '', component: SkillSelectionComponent },
  { path: 'teamselection', component: TeamSelectionComponent },
  { path: 'resultlist', component: ResultListComponent },
  { path: 'resultdetailforpoints', component: ResultDetailForPointsComponent },
  { path: 'resultdetailfortime', component: ResultDetailForTimeComponent },
  {
    path: 'resultdetailfortimemanual',
    component: ResultDetailForTimeManualComponent
  },
  {
    path: 'resultdetailfortimewithpoints',
    component: ResultDetailForTimeWithPointsComponent
  },
  { path: 'ratinglist', component: RatingListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SkillsOnIceRoutingModule {}
