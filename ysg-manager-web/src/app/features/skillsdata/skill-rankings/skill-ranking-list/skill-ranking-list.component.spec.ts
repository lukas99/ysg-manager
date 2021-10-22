import { TranslateService } from '@ngx-translate/core';
import { SkillRankingListComponent } from './skill-ranking-list.component';
import { SkillRankingsService } from '../../../../core/services/skill-rankings.service';

describe('SkillRankingListComponent', () => {
  let component: SkillRankingListComponent;

  let skillRankingsService: SkillRankingsService;
  let translateService: TranslateService;

  beforeEach(() => {
    skillRankingsService = <SkillRankingsService>{};
    translateService = <any>{
      instant: jest.fn().mockImplementation((translationKey) => translationKey)
    };
    component = new SkillRankingListComponent(
      skillRankingsService,
      translateService
    );
  });

  it('creates the options', () => {
    const options = component.crudListOptions;

    expect(options.columnDefs.length).toBe(9);
    expect(translateService.instant).toHaveBeenCalled();

    expect(options.crudService).toBe(skillRankingsService);
    expect(options.routerDetailUrl).toBeDefined();
  });
});
