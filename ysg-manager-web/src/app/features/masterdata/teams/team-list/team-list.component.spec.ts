import { TeamListComponent } from './team-list.component';
import { TeamsService } from '../../../../core/services/teams.service';
import { TranslateService } from '@ngx-translate/core';

describe('TeamListComponent', () => {
  let component: TeamListComponent;

  let teamsService: TeamsService;
  let translateService: TranslateService;

  beforeEach(() => {
    teamsService = <TeamsService>{};
    translateService = <any>{
      instant: jest.fn().mockImplementation((translationKey) => translationKey)
    };
    component = new TeamListComponent(teamsService, translateService);
  });

  it('can be created', () => {
    const options = component.crudListOptions;

    expect(options.columnDefs.length).toBe(1);
    expect(translateService.instant).toHaveBeenCalled();

    expect(options.crudService).toBe(teamsService);
    expect(options.routerDetailUrl).toBeDefined();
  });
});
