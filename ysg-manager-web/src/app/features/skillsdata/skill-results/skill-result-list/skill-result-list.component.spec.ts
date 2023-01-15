import { TranslateService } from '@ngx-translate/core';
import { SkillResultListComponent } from './skill-result-list.component';
import { SkillResultsService } from '../../../../core/services/skill-results.service';
import { SkillsService } from '../../../../core/services/skills.service';

describe('SkillResultListComponent', () => {
  let component: SkillResultListComponent;

  let skillResultsService: SkillResultsService;
  let skillsService: SkillsService;
  let translateService: TranslateService;

  beforeEach(() => {
    skillResultsService = <SkillResultsService>{};
    skillsService = <any>{
      getSelectedItemValue: jest.fn()
    };
    translateService = <any>{
      instant: jest.fn().mockImplementation((translationKey) => translationKey)
    };
    component = new SkillResultListComponent(
      skillResultsService,
      skillsService,
      translateService
    );
  });

  it('ngOnInit creates the options', () => {
    component.ngOnInit();

    const options = component.crudListOptions;

    expect(options.columnDefs.length).toBe(7);
    expect(translateService.instant).toHaveBeenCalled();

    expect(options.crudService).toBe(skillResultsService);
    expect(options.routerDetailUrl).toBeDefined();
  });
});
