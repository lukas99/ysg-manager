import { ResultDetailForTimeComponent } from './result-detail-for-time.component';
import { SkillsOnIceStateService } from '../../../core/services/skills-on-ice-state.service';
import { SkillResultsService } from '../../../core/services/skill-results.service';
import { Router } from '@angular/router';

describe('ResultDetailForTimeComponent', () => {
  let component: ResultDetailForTimeComponent;

  beforeEach(() => {
    component = new ResultDetailForTimeComponent(
      {} as SkillsOnIceStateService,
      {} as SkillResultsService,
      {} as Router
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});