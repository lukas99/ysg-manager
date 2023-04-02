import { TranslateService } from '@ngx-translate/core';
import { SkillRatingListComponent } from './skill-rating-list.component';
import { SkillRatingsService } from '../../../../core/services/skill-ratings.service';
import { SkillsService } from '../../../../core/services/skills.service';

describe('SkillRatingListComponent', () => {
  let component: SkillRatingListComponent;

  let skillRatingsService: SkillRatingsService;
  let skillsService: SkillsService;
  let translateService: TranslateService;

  beforeEach(() => {
    skillRatingsService = <SkillRatingsService>{};
    skillsService = <any>{
      getSelectedItemValue: jest.fn()
    };
    translateService = <any>{
      instant: jest.fn().mockImplementation((translationKey) => translationKey)
    };
    component = new SkillRatingListComponent(
      skillRatingsService,
      skillsService,
      translateService
    );
  });

  it('ngOnInit creates the options', () => {
    component.ngOnInit();

    const options = component.crudListOptions;

    expect(options.columnDefs.length).toBe(6);
    expect(translateService.instant).toHaveBeenCalled();

    expect(options.crudService).toBe(skillRatingsService);
    expect(options.routerDetailUrl).toBeDefined();
  });
});
