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

    expect(options.headers.length).toBe(4);
    expect(options.headers[0].key).toBe('firstName');
    expect(options.headers[0].title).toBe('PLAYER_FIRST_NAME');
    expect(options.headers[1].key).toBe('lastName');
    expect(options.headers[1].title).toBe('PLAYER_LAST_NAME');
    expect(options.headers[2].key).toBe('shirtNumber');
    expect(options.headers[2].title).toBe('PLAYER_SHIRT_NUMBER');
    expect(options.headers[3].key).toBe('position');
    expect(options.headers[3].title).toBe('PLAYER_POSITION');
    expect(translateService.instant).toHaveBeenCalledTimes(4);

    expect(options.crudService).toBe(playersService);
    expect(options.routerDetailUrl).toBeDefined();
  });
});
