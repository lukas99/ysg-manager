import { Component } from '@angular/core';
import { CrudListOptions } from '../../../../shared/crud/crud-list/crud-list.component';
import { TranslateService } from '@ngx-translate/core';
import { PlayersService } from '../../../../core/services/players.service';
import { TeamsService } from '../../../../core/services/teams.service';
import { Team } from '../../../../types';

@Component({
  selector: 'ysg-player-list',
  templateUrl: 'player-list.component.html',
  styleUrls: []
})
export class PlayerListComponent {
  crudListOptions: CrudListOptions;
  selectedTeam: Team = this.teamsService.getSelectedItemValue();

  constructor(
    private playersService: PlayersService,
    private teamsService: TeamsService,
    private translateService: TranslateService
  ) {
    this.crudListOptions = {
      headers: [
        {
          key: 'firstName',
          title: this.translateService.instant('PLAYER_FIRST_NAME')
        },
        {
          key: 'lastName',
          title: this.translateService.instant('PLAYER_LAST_NAME')
        },
        {
          key: 'shirtNumber',
          title: this.translateService.instant('PLAYER_SHIRT_NUMBER')
        },
        {
          key: 'position',
          title: this.translateService.instant('PLAYER_POSITION')
        }
      ],
      crudService: playersService,
      routerDetailUrl: '/masterdata/players/detail'
    };
  }
}
