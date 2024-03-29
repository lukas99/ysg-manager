import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SkillResultsService } from '../../../../core/services/skill-results.service';
import { PlayerPosition, Team } from '../../../../types';
import { SkillsService } from '../../../../core/services/skills.service';
import { CrudListOptions } from '../../../../shared/crud/crud-list/crud-list.component';

@Component({
  selector: 'ysg-skill-result-list',
  templateUrl: './skill-result-list.component.html',
  styleUrls: []
})
export class SkillResultListComponent implements OnInit {
  crudListOptions!: CrudListOptions;
  selectedSkill!: Team;

  constructor(
    private skillResultsService: SkillResultsService,
    private skillsService: SkillsService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.selectedSkill = this.skillsService.getSelectedItemValue();
    this.crudListOptions = {
      columnDefs: [
        {
          field: 'player.team.name',
          headerName: this.translateService.instant('SKILL_RESULT_PLAYER_TEAM'),
          sort: 'asc'
        },
        {
          field: 'player.shirtNumber',
          headerName: this.translateService.instant(
            'SKILL_RESULT_PLAYER_SHIRT_NUMBER'
          ),
          sort: 'asc'
        },
        {
          field: 'player.firstName',
          headerName: this.translateService.instant(
            'SKILL_RESULT_PLAYER_FIRST_NAME'
          )
        },
        {
          field: 'player.lastName',
          headerName: this.translateService.instant(
            'SKILL_RESULT_PLAYER_LAST_NAME'
          )
        },
        {
          field: 'player.position',
          headerName: this.translateService.instant(
            'SKILL_RANKING_PLAYER_POSITION'
          ),
          cellRenderer: (params) => this.translatePlayerPosition(params.value),
          filterValueGetter: (params) =>
            this.translatePlayerPosition(params.data.player.position)
        },
        {
          field: 'time',
          headerName: this.translateService.instant('SKILL_RESULT_TIME'),
          filter: 'agNumberColumnFilter'
        },
        {
          field: 'points',
          headerName: this.translateService.instant('SKILL_RESULT_POINTS'),
          filter: 'agNumberColumnFilter'
        },
        {
          field: 'failures',
          headerName: this.translateService.instant('SKILL_RESULT_FAILURES'),
          filter: 'agNumberColumnFilter'
        }
      ],
      crudService: this.skillResultsService,
      routerDetailUrl: '/skillresults/detail'
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
