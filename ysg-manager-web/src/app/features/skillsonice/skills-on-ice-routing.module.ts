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
import { RatingDetailComponent } from './skill-ratings/rating-detail.component';

const routes: Routes = [
  { path: '', component: SkillSelectionComponent },
  { path: 'skills/:skillId/teams', component: TeamSelectionComponent },
  {
    path: 'skills/:skillId/teams/:teamId/results',
    component: ResultListComponent
  },
  {
    path: 'skills/:skillId/teams/:teamId/resultdetailforpoints',
    component: ResultDetailForPointsComponent
  },
  {
    path: 'skills/:skillId/teams/:teamId/resultdetailforpoints/:resultId',
    component: ResultDetailForPointsComponent
  },
  {
    path: 'skills/:skillId/teams/:teamId/resultdetailfortime',
    component: ResultDetailForTimeComponent
  },
  {
    path: 'skills/:skillId/teams/:teamId/resultdetailfortime/:resultId',
    component: ResultDetailForTimeComponent
  },
  {
    path: 'skills/:skillId/teams/:teamId/resultdetailfortimemanual',
    component: ResultDetailForTimeManualComponent
  },
  {
    path: 'skills/:skillId/teams/:teamId/resultdetailfortimemanual/:resultId',
    component: ResultDetailForTimeManualComponent
  },
  {
    path: 'skills/:skillId/teams/:teamId/resultdetailfortimewithpoints',
    component: ResultDetailForTimeWithPointsComponent
  },
  {
    path: 'skills/:skillId/teams/:teamId/resultdetailfortimewithpoints/:resultId',
    component: ResultDetailForTimeWithPointsComponent
  },
  {
    path: 'skills/:skillId/teams/:teamId/ratings',
    component: RatingListComponent
  },
  {
    path: 'skills/:skillId/teams/:teamId/ratingdetail',
    component: RatingDetailComponent
  },
  {
    path: 'skills/:skillId/teams/:teamId/ratingdetail/:ratingId',
    component: RatingDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SkillsOnIceRoutingModule {}
