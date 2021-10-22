import { TranslateService } from '@ngx-translate/core';
import { SkillTournamentRankingListComponent } from './skill-tournament-ranking-list.component';
import { SkillTournamentRankingsService } from '../../../../core/services/skill-tournament-rankings.service';

describe('SkillTournamentRankingListComponent', () => {
  let component: SkillTournamentRankingListComponent;

  let skillTournamentRankingsService: SkillTournamentRankingsService;
  let translateService: TranslateService;

  beforeEach(() => {
    skillTournamentRankingsService = <SkillTournamentRankingsService>{};
    translateService = <any>{
      instant: jest.fn().mockImplementation((translationKey) => translationKey)
    };
    component = new SkillTournamentRankingListComponent(
      skillTournamentRankingsService,
      translateService
    );
  });

  it('creates the options', () => {
    const options = component.crudListOptions;

    expect(options.columnDefs.length).toBe(9);
    expect(translateService.instant).toHaveBeenCalled();

    expect(options.crudService).toBe(skillTournamentRankingsService);
    expect(options.routerDetailUrl).toBeDefined();
  });
});
