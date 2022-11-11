import { ResultDetailForTimeManualComponent } from './result-detail-for-time-manual.component';
import { SkillsOnIceStateService } from '../../../core/services/skills-on-ice-state.service';
import { SkillResultsService } from '../../../core/services/skill-results.service';
import { Router } from '@angular/router';

describe('ResultDetailForTimeManualComponent', () => {
  let component: ResultDetailForTimeManualComponent;

  beforeEach(() => {
    component = new ResultDetailForTimeManualComponent(
      {} as SkillsOnIceStateService,
      {} as SkillResultsService,
      {} as Router
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
