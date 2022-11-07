import { ResultDetailForTimeWithPointsComponent } from './result-detail-for-time-with-points.component';
import { SkillsOnIceStateService } from '../../../core/services/skills-on-ice-state.service';
import { SkillResultsService } from '../../../core/services/skill-results.service';
import { Router } from '@angular/router';

describe('ResultDetailForTimeWithPointsComponent', () => {
  let component: ResultDetailForTimeWithPointsComponent;

  beforeEach(() => {
    component = new ResultDetailForTimeWithPointsComponent(
      {} as SkillsOnIceStateService,
      {} as SkillResultsService,
      {} as Router
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
