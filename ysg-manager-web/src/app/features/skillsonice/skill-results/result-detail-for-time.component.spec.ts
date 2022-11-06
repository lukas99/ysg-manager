import { ResultDetailForTimeComponent } from './result-detail-for-time.component';
import { SkillsOnIceStateService } from '../../../core/services/skills-on-ice-state.service';
import { SkillResultsService } from '../../../core/services/skill-results.service';
import { Router } from '@angular/router';
import { Link, PlayerPosition, Skill, SkillResult, Team } from '../../../types';
import { HttpClient } from '@angular/common/http';
import { SkillsService } from '../../../core/services/skills.service';
import { CacheService } from '../../../core/services/cache.service';

describe('ResultDetailForTimeComponent', () => {
  let component: ResultDetailForTimeComponent;
  let stateService: SkillsOnIceStateService;
  let skillResultsService: SkillResultsService;
  let cacheService: CacheService;
  let router: Router;

  let removeSkillFromCache: any;
  let removeSelectedSkill: any;
  let updateSkillResultInCache: any;
  let addSkillResultToCache: any;

  let selectedTeamLink: Link;
  let selectedSkillLink: Link;
  let selectedTeam: Team;
  let selectedSkill: Skill;

  beforeEach(() => {
    stateService = new SkillsOnIceStateService();
    cacheService = <any>{
      addToCache: jest.fn(),
      updateInCache: jest.fn(),
      removeFromCache: jest.fn()
    };
    skillResultsService = new SkillResultsService(
      {} as HttpClient,
      {} as SkillsService,
      cacheService
    );
    removeSkillFromCache = jest.spyOn(
      skillResultsService,
      'removeSkillResultFromCache'
    );
    removeSelectedSkill = jest.spyOn(skillResultsService, 'removeSelectedItem');
    updateSkillResultInCache = jest.spyOn(
      skillResultsService,
      'updateSkillResultInCache'
    );
    addSkillResultToCache = jest.spyOn(
      skillResultsService,
      'addSkillResultToCache'
    );
    router = <any>{ navigateByUrl: jest.fn() };
    component = new ResultDetailForTimeComponent(
      stateService,
      skillResultsService,
      router
    );

    selectedTeamLink = {} as Link;
    selectedSkillLink = {} as Link;
    selectedTeam = { _links: { self: selectedTeamLink } } as Team;
    selectedSkill = { _links: { self: selectedSkillLink } } as Skill;
    stateService.setSelectedTeam(selectedTeam);
    stateService.setSelectedSkill(selectedSkill);
  });

  describe('ngOnInit', () => {
    it('sets the selected skill and team', () => {
      component.ngOnInit();
      expect(component.selectedTeam).toBe(selectedTeam);
      expect(component.selectedSkill).toBe(selectedSkill);
    });

    it('loads an existing result', () => {
      const existingResult = { time: 5.25 } as SkillResult;
      skillResultsService.setSelectedItem(existingResult);

      component.ngOnInit();

      expect(component.skillResult).toBe(existingResult);
    });

    it('initializes a new result', () => {
      expect(skillResultsService.getSelectedItemValue()).toEqual({});

      component.ngOnInit();

      expect(component.skillResult.time).toBe(0);
      expect(component.skillResult.failures).toBe(0);
      expect(component.skillResult.points).toBe(0);
      expect(component.skillResult.player.team).toBe(selectedTeam);
      expect(component.skillResult.player.position).toBe(PlayerPosition.SKATER);
      expect(component.skillResult.player._links.team).toBe(selectedTeamLink);
      expect(component.skillResult._links.skill).toBe(selectedSkillLink);
    });
  });

  it('should delete a skill result', () => {
    const skillResult = {} as SkillResult;
    component.skillResult = skillResult;

    component.delete();

    expect(removeSkillFromCache).toHaveBeenCalledWith(skillResult);
    expect(removeSelectedSkill).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('skillsonice/resultlist');
  });

  it('should cancel the skill result editing', () => {
    component.cancel();

    expect(removeSelectedSkill).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('skillsonice/resultlist');
  });

  describe('save', () => {
    it('should update an existing skill result', () => {
      const existingResult = { time: 5.25 } as SkillResult;
      skillResultsService.setSelectedItem(existingResult);
      component.ngOnInit();

      component.save();

      expect(skillResultsService.updateSkillResultInCache).toHaveBeenCalledWith(
        existingResult
      );
    });

    it('should create new result', () => {
      expect(skillResultsService.getSelectedItemValue()).toEqual({});
      component.ngOnInit();

      component.save();

      expect(skillResultsService.addSkillResultToCache).toHaveBeenCalledWith(
        component.skillResult
      );
    });
  });
});
