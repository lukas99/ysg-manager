import { NgModule } from '@angular/core';

import { SkillsOnIceRoutingModule } from './skills-on-ice-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { SkillSelectionComponent } from './skill-selection/skill-selection.component';
import { TeamSelectionComponent } from './team-selection/team-selection.component';
import { ResultListComponent } from './skill-results/result-list.component';
import { RatingListComponent } from './skill-ratings/rating-list.component';
import { ResultDetailForTimeComponent } from './skill-results/result-detail-for-time.component';
import { PlayerComponent } from './shared/player.component';
import { StopwatchComponent } from './shared/stopwatch.component';
import { FailuresComponent } from './shared/failures.component';
import { CrudButtonsComponent } from './shared/crud-buttons.component';
import { ResultDetailForTimeWithPointsComponent } from './skill-results/result-detail-for-time-with-points.component';
import { PointsComponent } from './shared/points.component';
import { ResultDetailForPointsComponent } from './skill-results/result-detail-for-points.component';
import { ResultDetailForTimeManualComponent } from './skill-results/result-detail-for-time-manual.component';
import { TimeManualComponent } from './shared/time-manual.component';
import { RatingDetailComponent } from './skill-ratings/rating-detail.component';
import { RatingComponent } from './shared/rating.component';
import { MsToSecondsPipe } from './shared/ms-to-seconds.pipe';

@NgModule({
  declarations: [
    SkillSelectionComponent,
    TeamSelectionComponent,
    ResultListComponent,
    RatingListComponent,
    ResultDetailForTimeComponent,
    PlayerComponent,
    StopwatchComponent,
    FailuresComponent,
    CrudButtonsComponent,
    ResultDetailForTimeWithPointsComponent,
    PointsComponent,
    ResultDetailForPointsComponent,
    ResultDetailForTimeManualComponent,
    TimeManualComponent,
    RatingDetailComponent,
    RatingComponent,
    MsToSecondsPipe
  ],
  imports: [SharedModule, SkillsOnIceRoutingModule]
})
export class SkillsOnIceModule {}
