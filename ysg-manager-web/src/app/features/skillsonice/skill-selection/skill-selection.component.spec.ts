import { SkillSelectionComponent } from './skill-selection.component';
import { Skill, SkillType } from '../../../types';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { SkillsService } from '../../../core/services/skills.service';
import { fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';

describe('SkillSelectionComponent', () => {
  let component: SkillSelectionComponent;

  let skillsService: SkillsService;
  let router: Router;
  let route: ActivatedRoute;

  let magicTransitions: Skill = {
    id: 1,
    typeForPlayers: SkillType.TIME_WITH_RATING,
    typeForGoaltenders: SkillType.TIME_WITH_RATING
  } as Skill;
  let bestShot: Skill = {
    id: 2,
    typeForPlayers: SkillType.POINTS,
    typeForGoaltenders: SkillType.POINTS
  } as Skill;
  let passAndGo: Skill = {
    id: 3,
    typeForPlayers: SkillType.TIME_WITH_POINTS,
    typeForGoaltenders: SkillType.TIME_WITH_POINTS
  } as Skill;
  let controlledJumble: Skill = {
    id: 4,
    typeForPlayers: SkillType.TIME,
    typeForGoaltenders: SkillType.RATING
  } as Skill;
  let hitTheRoad: Skill = {
    id: 5,
    typeForPlayers: SkillType.TIME_WITH_RATING,
    typeForGoaltenders: SkillType.RATING
  } as Skill;
  let goaltenders: Skill = {
    id: 6,
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
    router = <any>{ navigate: jest.fn() };
    route = <any>{ snapshot: { queryParamMap: convertToParamMap({}) } };

    component = new SkillSelectionComponent(skillsService, router, route);
  });

  describe('ngOnInit', () => {
    it('when loaded initially', () => {
      component.ngOnInit();
      expect(component.isSkillChef).toBeFalsy();
      expect(component.isRoleSelected).toBeFalsy();
    });

    it('when skill chef navigates back', () => {
      route = <any>{
        snapshot: { queryParamMap: convertToParamMap({ isSkillChef: 'true' }) }
      };
      component = new SkillSelectionComponent(skillsService, router, route);

      component.ngOnInit();
      expect(component.isSkillChef).toBeTruthy();
      expect(component.isRoleSelected).toBeTruthy();
    });

    it('when skill expert navigates back', () => {
      route = <any>{
        snapshot: { queryParamMap: convertToParamMap({ isSkillChef: 'false' }) }
      };
      component = new SkillSelectionComponent(skillsService, router, route);

      component.ngOnInit();
      expect(component.isSkillChef).toBeFalsy();
      expect(component.isRoleSelected).toBeTruthy();
    });

    it('loads the skills', fakeAsync(() => {
      component.ngOnInit();
      tick(50); // delay from loading-delay-indicator

      expect(component.skills).toEqual(skills);
      expect(component.loadingIndicator.isLoading).toEqual(false);
    }));
  });

  it('toggles role selection', () => {
    expect(component.isRoleSelected).toBeFalsy();
    expect(component.isSkillChef).toBeFalsy();

    component.roleToggleClicked(true);
    expect(component.isRoleSelected).toBeTruthy();
    expect(component.isSkillChef).toBeTruthy();

    component.roleToggleClicked(false);
    expect(component.isRoleSelected).toBeTruthy();
    expect(component.isSkillChef).toBeFalsy();
  });

  describe('showSkill', () => {
    it('shows the correct skills for a skill chef', () => {
      component.isSkillChef = true;
      expect(component.showSkill(magicTransitions)).toBeTruthy();
      expect(component.showSkill(bestShot)).toBeTruthy();
      expect(component.showSkill(passAndGo)).toBeTruthy();
      expect(component.showSkill(controlledJumble)).toBeTruthy();
      expect(component.showSkill(hitTheRoad)).toBeTruthy();
      expect(component.showSkill(goaltenders)).toBeFalsy();
    });

    it('shows the correct skills for a skill chef', () => {
      component.isSkillChef = false;
      expect(component.showSkill(magicTransitions)).toBeTruthy();
      expect(component.showSkill(bestShot)).toBeFalsy();
      expect(component.showSkill(passAndGo)).toBeFalsy();
      expect(component.showSkill(controlledJumble)).toBeTruthy();
      expect(component.showSkill(hitTheRoad)).toBeTruthy();
      expect(component.showSkill(goaltenders)).toBeFalsy();
    });
  });

  it('handles the selection of a skill', () => {
    component.isSkillChef = true;

    component.skillSelected(magicTransitions);

    expect(router.navigate).toHaveBeenCalledWith(
      ['skillsonice', 'skills', 1, 'teams'],
      { queryParams: { isSkillChef: true }, queryParamsHandling: 'merge' }
    );
  });
});
