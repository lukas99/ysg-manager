import { SkillListComponent } from './skill-list.component';
import { SkillsService } from '../../../../core/services/skills.service';
import { TranslateService } from '@ngx-translate/core';

describe('SkillListComponent', () => {
  let component: SkillListComponent;

  let skillsService: SkillsService;
  let translateService: TranslateService;

  beforeEach(() => {
    skillsService = <SkillsService>{};
    translateService = <any>{
      instant: jest.fn().mockImplementation((translationKey) => translationKey)
    };
    component = new SkillListComponent(skillsService, translateService);
  });

  it('creates the options', () => {
    const options = component.crudListOptions;

    expect(options.columnDefs.length).toBe(5);
    expect(translateService.instant).toHaveBeenCalled();

    expect(options.crudService).toBe(skillsService);
    expect(options.routerDetailUrl).toBeDefined();
  });
});
