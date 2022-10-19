import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PlayersService } from '../../../../core/services/players.service';
import { TeamsService } from '../../../../core/services/teams.service';
import { PlayerPosition, Team } from '../../../../types';
import { CrudListOptions } from '../../../../shared/crud/crud-list/crud-list.component';

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
      columnDefs: [
        {
          field: 'position',
          headerName: this.translateService.instant('PLAYER_POSITION'),
          cellRenderer: (params) => this.translatePlayerPosition(params.value),
          filterValueGetter: (params) =>
            this.translatePlayerPosition(params.data.position),
          sort: 'asc'
        },
        {
          field: 'shirtNumber',
          headerName: this.translateService.instant('PLAYER_SHIRT_NUMBER'),
          sort: 'asc'
        },
        {
          field: 'firstName',
          headerName: this.translateService.instant('PLAYER_FIRST_NAME')
        },
        {
          field: 'lastName',
          headerName: this.translateService.instant('PLAYER_LAST_NAME')
        }
      ],
      crudService: playersService,
      routerDetailUrl: '/players/detail'
    };
  }

  private translatePlayerPosition(playerPosition: PlayerPosition) {
    switch (playerPosition) {
      case PlayerPosition.SKATER: {
        return this.translateService.instant('PLAYER_POSITION_SKATER');
      }
      case PlayerPosition.GOALTENDER: {
        return this.translateService.instant('PLAYER_POSITION_GOALTENDER');
      }
      default: {
        return playerPosition;
      }
    }
  }
}
