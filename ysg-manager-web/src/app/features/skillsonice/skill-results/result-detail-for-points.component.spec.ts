import { SkillsOnIceStateService } from '../../../core/services/skills-on-ice-state.service';
import { SkillResultsService } from '../../../core/services/skill-results.service';
import { Router } from '@angular/router';
import { ResultDetailForPointsComponent } from './result-detail-for-points.component';

describe('ResultDetailForPointsComponent', () => {
  let component: ResultDetailForPointsComponent;

  beforeEach(() => {
    component = new ResultDetailForPointsComponent(
      {} as SkillsOnIceStateService,
      {} as SkillResultsService,
      {} as Router
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
