import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SkillsService } from '../../../../core/services/skills.service';
import { CrudListOptions } from '../../../../shared/crud/crud-list/crud-list.component';
import { SkillType } from '../../../../types';

@Component({
  selector: 'ysg-skill-list',
  templateUrl: './skill-list.component.html',
  styleUrls: []
})
export class SkillListComponent {
  crudListOptions: CrudListOptions;

  constructor(
    private skillsService: SkillsService,
    private translateService: TranslateService
  ) {
    this.crudListOptions = {
      columnDefs: [
        {
          field: 'number',
          headerName: this.translateService.instant('SKILL_NUMBER'),
          sort: 'asc'
        },
        {
          field: 'name',
          headerName: this.translateService.instant('SKILL_NAME')
        },
        {
          field: 'typeForPlayers',
          headerName: this.translateService.instant('SKILL_TYPE_FOR_PLAYERS'),
          cellRenderer: (params) => this.translateSkillType(params.value),
          filterValueGetter: (params) =>
            this.translateSkillType(params.data.typeForPlayers)
        },
        {
          field: 'typeForGoaltenders',
          headerName: this.translateService.instant(
            'SKILL_TYPE_FOR_GOALTENDERS'
          ),
          cellRenderer: (params) => this.translateSkillType(params.value),
          filterValueGetter: (params) =>
            this.translateSkillType(params.data.typeForGoaltenders)
        }
      ],
      crudService: skillsService,
      routerDetailUrl: '/skillsdata/skills/detail'
    };
  }

  private translateSkillType(skillType: SkillType) {
    switch (skillType) {
      case SkillType.TIME_WITH_RATING: {
        return this.translateService.instant('SKILL_TYPE_TIME_WITH_RATING');
      }
      case SkillType.TIME_WITH_POINTS: {
        return this.translateService.instant('SKILL_TYPE_TIME_WITH_POINTS');
      }
      case SkillType.TIME: {
        return this.translateService.instant('SKILL_TYPE_TIME');
      }
      case SkillType.POINTS: {
        return this.translateService.instant('SKILL_TYPE_POINTS');
      }
      case SkillType.RATING: {
        return this.translateService.instant('SKILL_TYPE_RATING');
      }
      case SkillType.GOALTENDERS_OVERALL: {
        return this.translateService.instant('SKILL_TYPE_GOALTENDERS_OVERALL');
      }
      case SkillType.NO_RESULTS: {
        return this.translateService.instant('SKILL_TYPE_NO_RESULTS');
      }
      default: {
        return skillType;
      }
    }
  }
}
