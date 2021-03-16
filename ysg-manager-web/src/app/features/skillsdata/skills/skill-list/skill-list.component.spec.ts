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

    expect(options.headers.length).toBe(3);
    expect(options.headers[0].key).toBe('name');
    expect(options.headers[0].title).toBe('SKILL_NAME');
    expect(options.headers[1].key).toBe('skillType');
    expect(options.headers[1].title).toBe('SKILL_TYPE');
    expect(options.headers[2].key).toBe('number');
    expect(options.headers[2].title).toBe('SKILL_NUMBER');
    expect(translateService.instant).toHaveBeenCalledTimes(3);

    expect(options.crudService).toBe(skillsService);
    expect(options.routerDetailUrl).toBeDefined();
  });
});
