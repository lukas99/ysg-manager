import { Component } from '@angular/core';
import { CrudListOptions } from '../../../../shared/crud/crud-list/crud-list.component';
import { TranslateService } from '@ngx-translate/core';
import { SkillsService } from '../../../../core/services/skills.service';

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
      headers: [
        {
          key: 'name',
          title: this.translateService.instant('SKILL_NAME')
        },
        {
          key: 'skillType',
          title: this.translateService.instant('SKILL_TYPE')
        },
        {
          key: 'number',
          title: this.translateService.instant('SKILL_NUMBER')
        }
      ],
      crudService: skillsService,
      routerDetailUrl: '/skills/skills/detail'
    };
  }
}
