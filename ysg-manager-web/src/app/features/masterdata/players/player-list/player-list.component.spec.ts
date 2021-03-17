import { PlayerListComponent } from './player-list.component';
import { PlayersService } from '../../../../core/services/players.service';
import { TranslateService } from '@ngx-translate/core';
import { TeamsService } from '../../../../core/services/teams.service';
import { Team } from '../../../../types';

describe('PlayerListComponent', () => {
  let component: PlayerListComponent;

  let playersService: PlayersService;
  let teamsService: TeamsService;
  let translateService: TranslateService;

  let selectedTeam: Team;

  beforeEach(() => {
    selectedTeam = <Team>{};

    playersService = <PlayersService>{};
    teamsService = <any>{
      getSelectedItemValue: jest.fn(() => selectedTeam)
    };
    translateService = <any>{
      instant: jest.fn().mockImplementation((translationKey) => translationKey)
    };
    component = new PlayerListComponent(
      playersService,
      teamsService,
      translateService
    );
  });

  it('initializes the selected team', () => {
    expect(component.selectedTeam).toBe(selectedTeam);
  });

  it('creates the options', () => {
    const options = component.crudListOptions;

    expect(options.columnDefs.length).toBe(4);
    expect(translateService.instant).toHaveBeenCalled();

    expect(options.crudService).toBe(playersService);
    expect(options.routerDetailUrl).toBeDefined();
  });
});
