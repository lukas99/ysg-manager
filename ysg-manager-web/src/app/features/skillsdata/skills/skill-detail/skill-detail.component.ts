import { Component } from '@angular/core';
import { CrudDetailOptions } from '../../../../shared/crud/crud-detail/crud-detail.component';
import { FormBuilder, Validators } from '@angular/forms';
import { SkillsService } from '../../../../core/services/skills.service';
import { SkillType } from '../../../../types';
import { TranslateService } from '@ngx-translate/core';

interface Type {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'ysg-skill-detail',
  templateUrl: './skill-detail.component.html',
  styleUrls: []
})
export class SkillDetailComponent {
  crudDetailOptions: CrudDetailOptions;

  skillTypes: Type[] = [
    {
      value: SkillType.TIME_WITH_RATING,
      viewValue: this.translateService.instant('SKILL_TYPE_TIME_WITH_RATING')
    },
    {
      value: SkillType.TIME_WITH_POINTS,
      viewValue: this.translateService.instant('SKILL_TYPE_TIME_WITH_POINTS')
    },
    {
      value: SkillType.TIME,
      viewValue: this.translateService.instant('SKILL_TYPE_TIME')
    },
    {
      value: SkillType.POINTS,
      viewValue: this.translateService.instant('SKILL_TYPE_POINTS')
    }
  ];

  constructor(
    private skillsService: SkillsService,
    private formBuilder: FormBuilder,
    private translateService: TranslateService
  ) {
    this.crudDetailOptions = {
      form: this.formBuilder.group({
        name: ['', Validators.required],
        skillType: [SkillType.TIME_WITH_RATING, Validators.required],
        number: [''],
        _links: ['']
      }),
      crudService: skillsService,
      routerListUrl: '/skills/skills'
    };
  }
}
