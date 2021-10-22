import { Component } from '@angular/core';
import { CrudListOptions } from '../../../../shared/crud/crud-list/crud-list.component';
import { TranslateService } from '@ngx-translate/core';
import { SkillRankingsService } from '../../../../core/services/skill-rankings.service';
import { PlayerPosition } from '../../../../types';

@Component({
  selector: 'ysg-skill-ranking-list',
  templateUrl: './skill-ranking-list.component.html',
  styleUrls: []
})
export class SkillRankingListComponent {
  crudListOptions: CrudListOptions;

  constructor(
    private skillRankingsService: SkillRankingsService,
    private translateService: TranslateService
  ) {
    this.crudListOptions = {
      columnDefs: [
        {
          field: 'skill.name',
          headerName: this.translateService.instant('SKILL_RANKING_SKILL_NAME')
        },
        {
          field: 'skill.number',
          headerName: this.translateService.instant(
            'SKILL_RANKING_SKILL_NUMBER'
          ),
          sort: 'asc'
        },
        {
          field: 'player.position',
          headerName: this.translateService.instant(
            'SKILL_RANKING_PLAYER_POSITION'
          ),
          cellRenderer: (params) => this.translatePlayerPosition(params.value),
          filterValueGetter: (params) =>
            this.translatePlayerPosition(params.data.player.position),
          sort: 'asc'
        },
        {
          field: 'sequence',
          headerName: this.translateService.instant('SKILL_RANKING_SEQUENCE'),
          filter: 'agNumberColumnFilter',
          sort: 'asc'
        },
        {
          field: 'rank',
          headerName: this.translateService.instant('SKILL_RANKING_RANK'),
          filter: 'agNumberColumnFilter',
          sort: 'asc'
        },
        {
          field: 'player.team.name',
          headerName: this.translateService.instant('SKILL_RANKING_PLAYER_TEAM')
        },
        {
          field: 'player.shirtNumber',
          headerName: this.translateService.instant(
            'SKILL_RANKING_PLAYER_SHIRT_NUMBER'
          )
        },
        {
          field: 'player.firstName',
          headerName: this.translateService.instant(
            'SKILL_RANKING_PLAYER_FIRST_NAME'
          )
        },
        {
          field: 'player.lastName',
          headerName: this.translateService.instant(
            'SKILL_RANKING_PLAYER_LAST_NAME'
          )
        }
      ],
      crudService: skillRankingsService,
      routerDetailUrl: ''
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
