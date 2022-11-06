import { ResultListComponent } from './result-list.component';
import { SkillResultsService } from '../../../core/services/skill-results.service';
import { SkillsOnIceStateService } from '../../../core/services/skills-on-ice-state.service';
import { Router } from '@angular/router';
import { SkillResult } from '../../../types';

describe('ResultListComponent', () => {
  let component: ResultListComponent;

  let stateService: SkillsOnIceStateService;
  let skillResultsService: SkillResultsService;
  let router: Router;

  beforeEach(() => {
    skillResultsService = <any>{
      setSelectedItem: jest.fn(),
      removeSelectedItem: jest.fn()
    };
    router = <any>{
      navigateByUrl: jest.fn()
    };

    component = new ResultListComponent(
      stateService,
      skillResultsService,
      router
    );
  });

  it('should edit a result', () => {
    const result = {} as SkillResult;

    component.editResult(result);

    expect(skillResultsService.setSelectedItem).toHaveBeenCalledWith(result);
    expect(router.navigateByUrl).toHaveBeenCalled();
  });

  it('should create a result', () => {
    component.createResult();

    expect(skillResultsService.removeSelectedItem).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalled();
  });
});
