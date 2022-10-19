import { SkillDetailComponent } from './skill-detail.component';
import { SkillsService } from '../../../../core/services/skills.service';
import { fakeAsync } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { PlayerPosition, Skill, SkillType } from '../../../../types';
import { SkillTypeService } from '../../../../core/services/skill-type.service';

describe('SkillDetailComponent', () => {
  let component: SkillDetailComponent;
  let skillsService: SkillsService;
  let skillTypeService: SkillTypeService;
  let formBuilder: FormBuilder;
  let translateService: TranslateService;
  let router: Router;

  let skill: Skill;

  beforeEach(() => {
    skill = {
      name: 'Magic Transitions',
      typeForPlayers: SkillType.TIME_WITH_RATING,
      typeForGoaltenders: SkillType.TIME_WITH_RATING,
      tournamentRankingPlayerPosition: PlayerPosition.SKATER,
      number: 1,
      _links: <any>{}
    };

    skillTypeService = <any>{
      canRecordResultForSkill: jest.fn(() => true),
      canRecordRatingForSkill: jest.fn(() => true)
    };
    skillsService = <any>{
      getSelectedItemValue: jest.fn(() => skill)
    };
    formBuilder = new FormBuilder();
    translateService = <any>{
      instant: jest.fn().mockImplementation((translationKey) => translationKey)
    };
    router = <any>{ navigateByUrl: jest.fn() };

    component = new SkillDetailComponent(
      skillsService,
      skillTypeService,
      formBuilder,
      translateService,
      router
    );
  });

  describe('the constructor', () => {
    it('initializes the positions array', () => {
      expect(component.skillTypes.length).toBe(7);
      expect(component.skillTypes[0].viewValue).toBe(
        'SKILL_TYPE_TIME_WITH_RATING'
      );
      expect(component.skillTypes[1].viewValue).toBe(
        'SKILL_TYPE_TIME_WITH_POINTS'
      );
      expect(component.skillTypes[2].viewValue).toBe('SKILL_TYPE_TIME');
      expect(component.skillTypes[3].viewValue).toBe('SKILL_TYPE_POINTS');
      expect(component.skillTypes[4].viewValue).toBe('SKILL_TYPE_RATING');
      expect(component.skillTypes[5].viewValue).toBe(
        'SKILL_TYPE_GOALTENDERS_OVERALL'
      );
      expect(component.skillTypes[6].viewValue).toBe('SKILL_TYPE_NO_RESULTS');
      expect(translateService.instant).toHaveBeenCalledTimes(9); // 7 + 2 position
    });

    it('initializes the positions array', () => {
      expect(component.positions.length).toBe(2);
      expect(component.positions[0].viewValue).toBe('PLAYER_POSITION_SKATER');
      expect(component.positions[1].viewValue).toBe(
        'PLAYER_POSITION_GOALTENDER'
      );
      expect(translateService.instant).toHaveBeenCalledTimes(9); // 2 + 7 skill types
    });

    it('creates the options', fakeAsync(() => {
      expect(component.crudDetailOptions.form).not.toBeNull();
      expect(component.crudDetailOptions.crudService).toBe(skillsService);
      expect(component.crudDetailOptions.routerListUrl).toBe('/skills');
    }));

    it('enables the skill result and rating buttons', () => {
      expect(component.enableSkillResults).toBeTruthy();
      expect(component.enableSkillRatings).toBeTruthy();
      expect(skillTypeService.canRecordResultForSkill).toHaveBeenCalledWith(
        skill
      );
      expect(skillTypeService.canRecordRatingForSkill).toHaveBeenCalledWith(
        skill
      );
    });
  });

  it('navigates to the results of the skill', () => {
    component.navigateToResultsOfSkill();
    expect(router.navigateByUrl).toHaveBeenCalled();
  });

  it('navigates to the ratings of the skill', () => {
    component.navigateToRatingsOfSkill();
    expect(router.navigateByUrl).toHaveBeenCalled();
  });
});
