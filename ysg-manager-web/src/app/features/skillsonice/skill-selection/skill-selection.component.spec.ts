import { SkillSelectionComponent } from './skill-selection.component';
import { Skill, SkillType } from '../../../types';
import { Router } from '@angular/router';
import { SkillsOnIceStateService } from '../../../core/services/skills-on-ice-state.service';
import { SkillsService } from '../../../core/services/skills.service';
import { fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';

describe('SkillSelectionComponent', () => {
  let component: SkillSelectionComponent;

  let skillsService: SkillsService;
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
  const skills = [
    magicTransitions,
    bestShot,
    passAndGo,
    controlledJumble,
    hitTheRoad,
    goaltenders
  ];

  beforeEach(() => {
    skillsService = <any>{ getSkills: jest.fn(() => of(skills)) };
    router = <any>{ navigateByUrl: jest.fn() };
    stateService = new SkillsOnIceStateService();

    component = new SkillSelectionComponent(
      skillsService,
      stateService,
      router
    );
  });

  it('loads the skills', fakeAsync(() => {
    component.ngOnInit();
    tick(50); // delay from loading-delay-indicator

    expect(component.skills).toEqual(skills);
    expect(component.loadingIndicator.isLoading).toEqual(false);
  }));

  it('toggles role selection', () => {
    component.ngOnInit();

    expect(component.isRoleSelected).toBeFalsy();
    expect(component.isSkillChef).toBeFalsy();
    expect(stateService.isRoleSelected()).toBeFalsy();
    expect(stateService.isSkillChef()).toBeFalsy();

    component.roleToggleClicked(true);
    expect(component.isRoleSelected).toBeTruthy();
    expect(component.isSkillChef).toBeTruthy();
    expect(stateService.isRoleSelected()).toBeTruthy();
    expect(stateService.isSkillChef()).toBeTruthy();

    component.roleToggleClicked(false);
    expect(component.isRoleSelected).toBeTruthy();
    expect(component.isSkillChef).toBeFalsy();
    expect(stateService.isRoleSelected()).toBeTruthy();
    expect(stateService.isSkillChef()).toBeFalsy();
  });

  describe('showSkill', () => {
    it('shows the correct skills for a skill chef', () => {
      stateService.setIsSkillChef(true);
      expect(component.showSkill(magicTransitions)).toBeTruthy();
      expect(component.showSkill(bestShot)).toBeTruthy();
      expect(component.showSkill(passAndGo)).toBeTruthy();
      expect(component.showSkill(controlledJumble)).toBeTruthy();
      expect(component.showSkill(hitTheRoad)).toBeTruthy();
      expect(component.showSkill(goaltenders)).toBeFalsy();
    });

    it('shows the correct skills for a skill chef', () => {
      stateService.setIsSkillChef(false);
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
