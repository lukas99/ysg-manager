import { NgModule } from '@angular/core';

import { SkillRatingsRoutingModule } from './skill-ratings-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { SkillRatingListComponent } from './skill-rating-list/skill-rating-list.component';
import { SkillRatingDetailComponent } from './skill-rating-detail/skill-rating-detail.component';

@NgModule({
  declarations: [SkillRatingListComponent, SkillRatingDetailComponent],
  imports: [SharedModule, SkillRatingsRoutingModule]
})
export class SkillRatingsModule {}
