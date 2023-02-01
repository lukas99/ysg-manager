import { SkillSelectionComponent } from './skill-selection.component';
import { TeamsService } from '../../../core/services/teams.service';
import { Skill, SkillType } from '../../../types';
import { Router } from '@angular/router';
import { SkillsOnIceStateService } from '../../../core/services/skills-on-ice-state.service';
import { SkillResultsService } from '../../../core/services/skill-results.service';
import { SkillsService } from '../../../core/services/skills.service';
import { SkillRatingsService } from '../../../core/services/skill-ratings.service';

describe('SkillSelectionComponent', () => {
  let component: SkillSelectionComponent;

  let skillsService: SkillsService;
  let teamsService: TeamsService;
  let skillResultsService: SkillResultsService;
  let skillRatingsService: SkillRatingsService;
  let stateService: SkillsOnIceStateService;
  let router: Router;

  let magicTransitions: Skill = {
    typeForPlayers: SkillType.TIME_WITH_RATING,
    typeForGoaltenders: SkillType.TIME_WITH_RATING
  } as Skill;
  let bestShot: Skill = {
    typeForPlayers: SkillType.POINTS,
    typeForGoaltenders: SkillType.POINTS
  } as Skill;
  let passAndGo: Skill = {
    typeForPlayers: SkillType.TIME_WITH_POINTS,
    typeForGoaltenders: SkillType.TIME_WITH_POINTS
  } as Skill;
  let controlledJumble: Skill = {
    typeForPlayers: SkillType.TIME,
    typeForGoaltenders: SkillType.RATING
  } as Skill;
  let hitTheRoad: Skill = {
    typeForPlayers: SkillType.TIME_WITH_RATING,
    typeForGoaltenders: SkillType.RATING
  } as Skill;
  let goaltenders: Skill = {
    typeForPlayers: SkillType.NO_RESULTS,
    typeForGoaltenders: SkillType.GOALTENDERS_OVERALL
  } as Skill;

  beforeEach(() => {
    skillsService = <any>{};
    teamsService = <any>{};
    skillResultsService = <any>{ pushCachedSkillResultsToServer: jest.fn() };
    skillRatingsService = <any>{ pushCachedSkillRatingsToServer: jest.fn() };
    router = <any>{ navigateByUrl: jest.fn() };
    stateService = new SkillsOnIceStateService();

    component = new SkillSelectionComponent(
      skillsService,
      teamsService,
      skillResultsService,
      skillRatingsService,
      stateService,
      router
    );
  });

  it('toggles role selection', () => {
    expect(component.isRoleSelected).toBeFalsy();
    expect(stateService.isSkillChef()).toBeFalsy();

    component.roleToggleClicked(true);
    expect(component.isRoleSelected).toBeTruthy();
    expect(stateService.isSkillChef()).toBeTruthy();

    component.roleToggleClicked(false);
    expect(component.isRoleSelected).toBeTruthy();
    expect(stateService.isSkillChef()).toBeFalsy();
  });

  describe('showSkill', () => {
    it('shows the correct skills for a skill chef', () => {
      stateService.setSkillChef(true);
      expect(component.showSkill(magicTransitions)).toBeTruthy();
      expect(component.showSkill(bestShot)).toBeTruthy();
      expect(component.showSkill(passAndGo)).toBeTruthy();
      expect(component.showSkill(controlledJumble)).toBeTruthy();
      expect(component.showSkill(hitTheRoad)).toBeTruthy();
      expect(component.showSkill(goaltenders)).toBeFalsy();
    });

    it('shows the correct skills for a skill chef', () => {
      stateService.setSkillChef(false);
      expect(component.showSkill(magicTransitions)).toBeTruthy();
      expect(component.showSkill(bestShot)).toBeFalsy();
      expect(component.showSkill(passAndGo)).toBeFalsy();
      expect(component.showSkill(controlledJumble)).toBeTruthy();
      expect(component.showSkill(hitTheRoad)).toBeTruthy();
      expect(component.showSkill(goaltenders)).toBeFalsy();
    });
  });

  it('handles the selection of a skill', () => {
    component.skillSelected(magicTransitions);

    expect(stateService.getSelectedSkill()).toEqual(magicTransitions);
    expect(router.navigateByUrl).toHaveBeenCalledWith(
      'skillsonice/teamselection'
    );
  });
});
