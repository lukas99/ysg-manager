import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SkillResultsService } from '../../../../core/services/skill-results.service';
import { Team } from '../../../../types';
import { SkillsService } from '../../../../core/services/skills.service';
import { CrudListOptionsAg } from '../../../../shared/crud/crud-list-aggrid/crud-list-ag.component';

@Component({
  selector: 'ysg-skill-result-list',
  templateUrl: './skill-result-list.component.html',
  styleUrls: []
})
export class SkillResultListComponent {
  crudListOptions: CrudListOptionsAg;
  selectedSkill: Team = this.skillsService.getSelectedItemValue();

  constructor(
    private skillResultsService: SkillResultsService,
    private skillsService: SkillsService,
    private translateService: TranslateService
  ) {
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
          field: 'time',
          headerName: this.translateService.instant('SKILL_RESULT_TIME'),
          filter: 'agNumberColumnFilter'
        },
        {
          field: 'failures',
          headerName: this.translateService.instant('SKILL_RESULT_FAILURES'),
          filter: 'agNumberColumnFilter'
        },
        {
          field: 'points',
          headerName: this.translateService.instant('SKILL_RESULT_POINTS'),
          filter: 'agNumberColumnFilter'
        }
      ],
      crudService: skillResultsService,
      routerDetailUrl: '/skillsdata/skillresults/detail'
    };
  }
}