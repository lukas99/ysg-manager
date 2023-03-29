import { SkillResultsService } from '../../../core/services/skill-results.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ResultDetailForPointsComponent } from './result-detail-for-points.component';
import { SkillTypeService } from '../../../core/services/skill-type.service';
import { SkillsService } from '../../../core/services/skills.service';
import { TeamsService } from '../../../core/services/teams.service';

describe('ResultDetailForPointsComponent', () => {
  let component: ResultDetailForPointsComponent;

  beforeEach(() => {
    component = new ResultDetailForPointsComponent(
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
