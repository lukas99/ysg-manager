import { Component, OnInit } from '@angular/core';
import { CrudListOptions } from '../../../../shared/crud/crud-list/crud-list.component';
import { PlayerPosition, Team } from '../../../../types';
import { SkillRatingsService } from '../../../../core/services/skill-ratings.service';
import { SkillsService } from '../../../../core/services/skills.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ysg-skill-rating-list',
  templateUrl: './skill-rating-list.component.html',
  styleUrls: []
})
export class SkillRatingListComponent implements OnInit {
  crudListOptions!: CrudListOptions;
  selectedSkill!: Team;

  constructor(
    private skillRatingsService: SkillRatingsService,
    private skillsService: SkillsService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.selectedSkill = this.skillsService.getSelectedItemValue();
    this.crudListOptions = {
      columnDefs: [
        {
          field: 'player.team.name',
          headerName: this.translateService.instant('SKILL_RATING_PLAYER_TEAM'),
          sort: 'asc'
        },
        {
          field: 'player.shirtNumber',
          headerName: this.translateService.instant(
            'SKILL_RATING_PLAYER_SHIRT_NUMBER'
          ),
          sort: 'asc'
        },
        {
          field: 'player.firstName',
          headerName: this.translateService.instant(
            'SKILL_RATING_PLAYER_FIRST_NAME'
          )
        },
        {
          field: 'player.lastName',
          headerName: this.translateService.instant(
            'SKILL_RATING_PLAYER_LAST_NAME'
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
          field: 'score',
          headerName: this.translateService.instant('SKILL_RATING_SCORE'),
          filter: 'agNumberColumnFilter'
        }
      ],
      crudService: this.skillRatingsService,
      routerDetailUrl: '/skillratings/detail'
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
