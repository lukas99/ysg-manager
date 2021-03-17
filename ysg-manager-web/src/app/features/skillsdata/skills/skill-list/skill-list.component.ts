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
          field: 'name',
          headerName: this.translateService.instant('SKILL_NAME')
        },
        {
          field: 'skillType',
          headerName: this.translateService.instant('SKILL_TYPE'),
          cellRenderer: (params) => this.translateSkillType(params.value),
          filterValueGetter: (params) =>
            this.translateSkillType(params.data.skillType)
        },
        {
          field: 'number',
          headerName: this.translateService.instant('SKILL_NUMBER'),
          sort: 'asc'
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
      default: {
        return skillType;
      }
    }
  }
}
