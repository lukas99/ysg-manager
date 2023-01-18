import { Component, OnInit } from '@angular/core';
import { CrudDetailOptions } from '../../../../shared/crud/crud-detail/crud-detail.component';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { SkillsService } from '../../../../core/services/skills.service';
import { PlayerPosition, Skill, SkillType } from '../../../../types';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { SkillTypeService } from '../../../../core/services/skill-type.service';

interface ViewObject {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'ysg-skill-detail',
  templateUrl: './skill-detail.component.html',
  styleUrls: []
})
export class SkillDetailComponent implements OnInit {
  crudDetailOptions!: CrudDetailOptions;
  enableSkillResults = false;
  enableSkillRatings = false;

  skillTypes: ViewObject[] = [];
  positions: ViewObject[] = [];

  constructor(
    private skillsService: SkillsService,
    private skillTypeService: SkillTypeService,
    private formBuilder: UntypedFormBuilder,
    private translateService: TranslateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.skillTypes = [
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
      },
      {
        value: SkillType.RATING,
        viewValue: this.translateService.instant('SKILL_TYPE_RATING')
      },
      {
        value: SkillType.GOALTENDERS_OVERALL,
        viewValue: this.translateService.instant(
          'SKILL_TYPE_GOALTENDERS_OVERALL'
        )
      },
      {
        value: SkillType.NO_RESULTS,
        viewValue: this.translateService.instant('SKILL_TYPE_NO_RESULTS')
      }
    ];

    this.positions = [
      {
        value: PlayerPosition.SKATER,
        viewValue: this.translateService.instant('PLAYER_POSITION_SKATER')
      },
      {
        value: PlayerPosition.GOALTENDER,
        viewValue: this.translateService.instant('PLAYER_POSITION_GOALTENDER')
      }
    ];

    this.crudDetailOptions = {
      form: this.formBuilder.group({
        name: ['', Validators.required],
        typeForPlayers: [SkillType.NO_RESULTS, Validators.required],
        typeForGoaltenders: [SkillType.NO_RESULTS, Validators.required],
        tournamentRankingPlayerPosition: [
          PlayerPosition.SKATER,
          Validators.required
        ],
        number: [''],
        _links: ['']
      }),
      crudService: this.skillsService,
      routerListUrl: '/skills'
    };

    const selectedSkill: Skill = this.skillsService.getSelectedItemValue();
    if (selectedSkill && selectedSkill.name) {
      this.enableSkillResults =
        this.skillTypeService.canRecordResultForSkill(selectedSkill);
      this.enableSkillRatings =
        this.skillTypeService.canRecordRatingForSkill(selectedSkill);
    }
  }

  navigateToResultsOfSkill() {
    this.router.navigateByUrl('/skillresults');
  }

  navigateToRatingsOfSkill() {
    this.router.navigateByUrl('/skillratings');
  }
}
