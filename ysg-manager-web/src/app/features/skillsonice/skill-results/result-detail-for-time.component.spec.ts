import { ResultDetailForTimeComponent } from './result-detail-for-time.component';
import { SkillResultsService } from '../../../core/services/skill-results.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SkillTypeService } from '../../../core/services/skill-type.service';
import { SkillsService } from '../../../core/services/skills.service';
import { TeamsService } from '../../../core/services/teams.service';

describe('ResultDetailForTimeComponent', () => {
  let component: ResultDetailForTimeComponent;

  beforeEach(() => {
    component = new ResultDetailForTimeComponent(
      {} as SkillsService,
      {} as TeamsService,
      {} as SkillResultsService,
      {} as SkillTypeService,
      {} as Router,
      {} as ActivatedRoute
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
