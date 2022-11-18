import { ResultDetailForTimeComponent } from './result-detail-for-time.component';
import { SkillsOnIceStateService } from '../../../core/services/skills-on-ice-state.service';
import { SkillResultsService } from '../../../core/services/skill-results.service';
import { Router } from '@angular/router';
import {
  Link,
  PlayerPosition,
  Skill,
  SkillResult,
  SkillType,
  Team
} from '../../../types';
import { HttpClient } from '@angular/common/http';
import { SkillsService } from '../../../core/services/skills.service';
import { SkillScoresService } from '../../../core/services/skill-scores.service';
import { CacheService } from '../../../core/services/cache.service';
import { SkillTypeService } from '../../../core/services/skill-type.service';

describe('ResultDetailModel', () => {
  let component: ResultDetailForTimeComponent;
  let stateService: SkillsOnIceStateService;
  let skillResultsService: SkillResultsService;
  let cacheService: CacheService<SkillResult>;
  let router: Router;

  let removeSkillFromCache: any;
  let removeSelectedSkill: any;
  let updateSkillResultInCache: any;
  let addSkillResultToCache: any;
  let getCachedSkillResult: any;

  let selectedTeamLink: Link;
  let selectedSkillLink: Link;
  let selectedTeam: Team;
  let selectedSkill: Skill;

  let showAlertDialogResultAlreadyExists: any;

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
      new SkillScoresService<SkillResult>(cacheService)
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
    getCachedSkillResult = jest.spyOn(
      skillResultsService,
      'getCachedSkillResult'
    );
    // result for same player does not yet exist in cache
    getCachedSkillResult.mockImplementation(() => {});

    router = <any>{ navigateByUrl: jest.fn() };
    component = new ResultDetailForTimeComponent(
      stateService,
      skillResultsService,
      new SkillTypeService(),
      router
    );

    selectedTeamLink = {} as Link;
    selectedSkillLink = {} as Link;
    selectedTeam = { _links: { self: selectedTeamLink } } as Team;
    selectedSkill = { _links: { self: selectedSkillLink } } as Skill;
    stateService.setSelectedTeam(selectedTeam);
    stateService.setSelectedSkill(selectedSkill);

    showAlertDialogResultAlreadyExists = jest.spyOn(
      component,
      'showAlertDialogResultForSkillAlreadyExists'
    );
    showAlertDialogResultAlreadyExists.mockImplementation(() => {});
  });

  describe('ngOnInit', () => {
    it('sets the selected skill and team', () => {
      component.ngOnInit();
      expect(component.selectedTeam).toBe(selectedTeam);
      expect(component.selectedSkill).toBe(selectedSkill);
    });

    describe('result exists', () => {
      let existingResult: SkillResult;

      beforeEach(() => {
        existingResult = { time: 5.25 } as SkillResult;
        skillResultsService.setSelectedItem(existingResult);
      });

      it('loads an existing result', () => {
        component.ngOnInit();
        expect(component.skillResult).toBe(existingResult);
      });

      it('disables the player position toggle', () => {
        selectedSkill.name = 'Controlled Jumble';
        selectedSkill.typeForPlayers = SkillType.TIME;
        selectedSkill.typeForGoaltenders = SkillType.RATING;
        stateService.setSelectedSkill(selectedSkill);

        component.ngOnInit();

        expect(component.disablePlayerPositionToggle).toBeTruthy();
        expect(component.skillResult).toBe(existingResult);
      });

      it('enables the player position toggle', () => {
        selectedSkill.name = 'skillResult';
        selectedSkill.typeForPlayers = SkillType.TIME_WITH_RATING;
        selectedSkill.typeForGoaltenders = SkillType.TIME_WITH_RATING;
        stateService.setSelectedSkill(selectedSkill);

        component.ngOnInit();

        expect(component.disablePlayerPositionToggle).toBeFalsy();
        expect(component.skillResult).toBe(existingResult);
      });
    });

    describe('new result', () => {
      beforeEach(() => {
        expect(skillResultsService.getSelectedItemValue()).toEqual({});
      });

      it('initializes a new result', () => {
        component.ngOnInit();

        expect(component.skillResult.time).toBe(0);
        expect(component.skillResult.failures).toBe(0);
        expect(component.skillResult.points).toBe(0);
        expect(component.skillResult.player.team).toBe(selectedTeam);
        expect(component.skillResult.player.position).toBe(
          PlayerPosition.SKATER
        );
        expect(component.skillResult.player._links.team).toBe(selectedTeamLink);
        expect(component.skillResult._links.skill).toBe(selectedSkillLink);
      });

      it('disables the player position toggle and preselects the position value', () => {
        selectedSkill.name = 'Controlled Jumble';
        selectedSkill.typeForPlayers = SkillType.TIME;
        selectedSkill.typeForGoaltenders = SkillType.RATING;
        stateService.setSelectedSkill(selectedSkill);

        component.ngOnInit();

        expect(component.disablePlayerPositionToggle).toBeTruthy();
        expect(component.skillResult.player.position).toBe(
          PlayerPosition.SKATER
        );
      });

      it('enables the player position toggle', () => {
        selectedSkill.name = 'skillResult';
        selectedSkill.typeForPlayers = SkillType.TIME_WITH_RATING;
        selectedSkill.typeForGoaltenders = SkillType.TIME_WITH_RATING;
        stateService.setSelectedSkill(selectedSkill);

        component.ngOnInit();

        expect(component.disablePlayerPositionToggle).toBeFalsy();
        expect(component.skillResult.player.position).toBe(
          PlayerPosition.SKATER
        );
      });
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
    it('should allow to update own result which already exists in cache', () => {
      const existingResult = { time: 2.5, cacheId: '9999' } as SkillResult;
      skillResultsService.setSelectedItem(existingResult);
      component.ngOnInit();
      // result for this player already exists in cache (it's the result we want to update)
      getCachedSkillResult.mockImplementation(
        () => ({ time: 2.5, cacheId: '9999' } as SkillResult)
      );

      component.save();

      expect(skillResultsService.updateSkillResultInCache).toHaveBeenCalledWith(
        existingResult
      );
      expect(removeSelectedSkill).toHaveBeenCalled();
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        'skillsonice/resultlist'
      );
    });

    it('should prevent to update result to player which already exists in cache', () => {
      const existingResult = { time: 2.5, cacheId: '9999' } as SkillResult;
      skillResultsService.setSelectedItem(existingResult);
      component.ngOnInit();
      // result for this player already exists in cache (it's another result)
      getCachedSkillResult.mockImplementation(
        () => ({ time: 2.5, cacheId: '8888' } as SkillResult)
      );

      component.save();

      expect(showAlertDialogResultAlreadyExists).toHaveBeenCalledTimes(1);

      expect(
        skillResultsService.updateSkillResultInCache
      ).toHaveBeenCalledTimes(0);
      expect(skillResultsService.addSkillResultToCache).toHaveBeenCalledTimes(
        0
      );
      expect(removeSelectedSkill).toHaveBeenCalledTimes(0);
      expect(router.navigateByUrl).toHaveBeenCalledTimes(0);
    });

    it('should create new result', () => {
      expect(skillResultsService.getSelectedItemValue()).toEqual({});
      component.ngOnInit();

      component.save();

      expect(skillResultsService.addSkillResultToCache).toHaveBeenCalledWith(
        component.skillResult
      );
      expect(removeSelectedSkill).toHaveBeenCalled();
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        'skillsonice/resultlist'
      );
    });

    it('should prevent to create a new result when a result already exists in cache', () => {
      expect(skillResultsService.getSelectedItemValue()).toEqual({});
      component.ngOnInit();
      // result for this player already exists in cache
      getCachedSkillResult.mockImplementation(() => ({} as SkillResult));

      component.save();

      expect(showAlertDialogResultAlreadyExists).toHaveBeenCalledTimes(1);

      expect(
        skillResultsService.updateSkillResultInCache
      ).toHaveBeenCalledTimes(0);
      expect(skillResultsService.addSkillResultToCache).toHaveBeenCalledTimes(
        0
      );
      expect(removeSelectedSkill).toHaveBeenCalledTimes(0);
      expect(router.navigateByUrl).toHaveBeenCalledTimes(0);
    });
  });

  describe('playerChanged', () => {
    beforeEach(() => {
      // create new result
      expect(skillResultsService.getSelectedItemValue()).toEqual({});
      component.ngOnInit();
      // set shirt number
      component.skillResult.player.shirtNumber = 20;
    });

    it('detects that a skill result for a player already exists', () => {
      // result for this player already exists in cache
      getCachedSkillResult.mockImplementation(() => ({} as SkillResult));

      component.playerChanged();

      expect(component.skillResult.player.shirtNumber).toBe(0);
      expect(showAlertDialogResultAlreadyExists).toHaveBeenCalledTimes(1);
    });

    it('detects that a skill result for a player not yet exists', () => {
      // result for this player already exists in cache
      getCachedSkillResult.mockImplementation(() => null);

      component.playerChanged();

      expect(component.skillResult.player.shirtNumber).toBe(20);
      expect(showAlertDialogResultAlreadyExists).toHaveBeenCalledTimes(0);
    });
  });
});
