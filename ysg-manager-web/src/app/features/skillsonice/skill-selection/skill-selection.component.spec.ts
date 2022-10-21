import { SkillSelectionComponent } from './skill-selection.component';
import { SkillsService } from '../../../core/services/skills.service';
import { TeamsService } from '../../../core/services/teams.service';
import { Skill, SkillType } from '../../../types';

describe('SkillSelectionComponent', () => {
  let component: SkillSelectionComponent;

  let skillsService: SkillsService;
  let teamsService: TeamsService;

  beforeEach(() => {
    skillsService = <any>{};
    component = new SkillSelectionComponent(skillsService, teamsService);
  });

  it('toggles role selection', () => {
    expect(component.isRoleSelected).toBeFalsy();
    expect(component.isSkillChef).toBeFalsy();

    component.roleToggleClicked();
    expect(component.isRoleSelected).toBeTruthy();
    expect(component.isSkillChef).toBeTruthy();

    component.roleToggleClicked();
    expect(component.isRoleSelected).toBeTruthy();
    expect(component.isSkillChef).toBeFalsy();
  });

  describe('showSkill', () => {
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
});