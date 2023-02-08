import { ResultDetailForTimeComponent } from './result-detail-for-time.component';
import { SkillsOnIceStateService } from '../../../core/services/skills-on-ice-state.service';
import { Router } from '@angular/router';
import {
  Link,
  PlayerPosition,
  Skill,
  SkillResult,
  SkillType,
  Team
} from '../../../types';
import { SkillTypeService } from '../../../core/services/skill-type.service';
import { of } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';

describe('ResultDetailModel', () => {
  let component: ResultDetailForTimeComponent;
  let stateService: SkillsOnIceStateService;
  let skillResultsService: any;
  let router: Router;

  let selectedTeamLink: Link;
  let selectedSkillLink: Link;
  let selectedTeam: Team;
  let selectedSkill: Skill;

  let showAlertDialogResultAlreadyExists: any;

  beforeEach(() => {
    stateService = new SkillsOnIceStateService();
    skillResultsService = <any>{
      // no item is selected -> would create new item
      getSelectedItemValue: jest.fn(() => {
        return {};
      }),
      deleteSkillResult: jest.fn(() => of({})),
      removeSelectedItem: jest.fn(),
      updateSkillResult: jest.fn(() => of({})),
      createSkillResult: jest.fn(() => of({})),
      // result for same player does not yet exist
      getSkillResultsBySkillAndTeamAndPlayerShirtNumber: jest.fn(() => of([]))
    };
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
      const existingResult = { time: 5.25 } as SkillResult;
      skillResultsService.getSelectedItemValue = jest.fn(() => existingResult);

      component.ngOnInit();

      expect(component.selectedTeam).toBe(selectedTeam);
      expect(component.selectedSkill).toBe(selectedSkill);
    });

    describe('result exists', () => {
      let existingResult: SkillResult;

      beforeEach(() => {
        existingResult = { time: 5.25 } as SkillResult;
        skillResultsService.getSelectedItemValue = jest.fn(
          () => existingResult
        );
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

  it('should delete a skill result', fakeAsync(() => {
    const skillResult = {} as SkillResult;
    component.skillResult = skillResult;
    skillResultsService.deleteSkillResult = jest.fn(() => of(skillResult));

    component.delete();
    tick(50); // delay from loading-delay-indicator

    expect(component.loadingIndicator.isLoading).toBe(false);
    expect(skillResultsService.deleteSkillResult).toHaveBeenCalledWith(
      skillResult
    );
    expect(skillResultsService.removeSelectedItem).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('skillsonice/resultlist');
  }));

  it('should cancel the skill result editing', () => {
    component.cancel();

    expect(skillResultsService.removeSelectedItem).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('skillsonice/resultlist');
  });

  describe('save', () => {
    it('should allow to update own result which already exists', fakeAsync(() => {
      const existingResult = {
        time: 2.5,
        player: { shirtNumber: 20 },
        _links: { self: { href: 'self-link' } }
      } as SkillResult;
      skillResultsService.getSelectedItemValue = jest.fn(() => existingResult);
      component.ngOnInit();
      // result for this player already exists (it's the result we want to update)
      skillResultsService.getSkillResultsBySkillAndTeamAndPlayerShirtNumber =
        jest.fn(() =>
          of([
            {
              time: 2.5,
              player: { shirtNumber: 20 },
              _links: { self: { href: 'self-link' } }
            } as SkillResult
          ])
        );

      component.save();
      tick(50); // delay from loading-delay-indicator

      expect(skillResultsService.updateSkillResult).toHaveBeenCalledWith(
        existingResult
      );
      expect(skillResultsService.removeSelectedItem).toHaveBeenCalled();
      expect(component.loadingIndicator.isLoading).toBe(false);
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        'skillsonice/resultlist'
      );
    }));

    it('should prevent to update result to player which already exists', fakeAsync(() => {
      const existingResult = {
        time: 2.5,
        player: { shirtNumber: 20 },
        _links: { self: { href: 'self-link' } }
      } as SkillResult;
      skillResultsService.getSelectedItemValue = jest.fn(() => existingResult);
      component.ngOnInit();
      // result for this player already exists (it's another result)
      skillResultsService.getSkillResultsBySkillAndTeamAndPlayerShirtNumber =
        jest.fn(() =>
          of([
            {
              time: 2.5,
              player: { shirtNumber: 20 },
              _links: { self: { href: 'other-link' } }
            } as SkillResult
          ])
        );

      component.save();
      tick(50); // delay from loading-delay-indicator

      expect(showAlertDialogResultAlreadyExists).toHaveBeenCalledTimes(1);

      expect(skillResultsService.updateSkillResult).toHaveBeenCalledTimes(0);
      expect(skillResultsService.createSkillResult).toHaveBeenCalledTimes(0);
      expect(skillResultsService.removeSelectedItem).toHaveBeenCalledTimes(0);
      expect(component.loadingIndicator.isLoading).toBe(false);
      expect(router.navigateByUrl).toHaveBeenCalledTimes(0);
    }));

    it('should create new result', fakeAsync(() => {
      expect(skillResultsService.getSelectedItemValue()).toEqual({});
      component.ngOnInit();
      // result for this player doesn't yet exist
      skillResultsService.getSkillResultsBySkillAndTeamAndPlayerShirtNumber =
        jest.fn(() => of([]));

      component.save();
      tick(50); // delay from loading-delay-indicator

      expect(skillResultsService.createSkillResult).toHaveBeenCalledWith(
        component.skillResult,
        selectedSkill
      );
      expect(skillResultsService.removeSelectedItem).toHaveBeenCalled();
      expect(component.loadingIndicator.isLoading).toBe(false);
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        'skillsonice/resultlist'
      );
    }));

    it('should prevent to create a new result when a result already exists', fakeAsync(() => {
      expect(skillResultsService.getSelectedItemValue()).toEqual({});
      component.ngOnInit();
      // result for this player already exists
      skillResultsService.getSkillResultsBySkillAndTeamAndPlayerShirtNumber =
        jest.fn(() =>
          of([
            {
              time: 2.5,
              player: { shirtNumber: 20 },
              _links: { self: { href: 'self-link' } }
            } as SkillResult
          ])
        );

      component.save();
      tick(50); // delay from loading-delay-indicator

      expect(showAlertDialogResultAlreadyExists).toHaveBeenCalledTimes(1);

      expect(skillResultsService.updateSkillResult).toHaveBeenCalledTimes(0);
      expect(skillResultsService.createSkillResult).toHaveBeenCalledTimes(0);
      expect(skillResultsService.removeSelectedItem).toHaveBeenCalledTimes(0);
      expect(component.loadingIndicator.isLoading).toBe(false);
      expect(router.navigateByUrl).toHaveBeenCalledTimes(0);
    }));
  });

  describe('playerChanged', () => {
    beforeEach(() => {
      // create new result
      expect(skillResultsService.getSelectedItemValue()).toEqual({});
      component.ngOnInit();
      // set shirt number
      component.skillResult.player.shirtNumber = 20;
    });

    it('detects that a skill result for a player already exists', fakeAsync(() => {
      // result for this player already exists
      skillResultsService.getSkillResultsBySkillAndTeamAndPlayerShirtNumber =
        jest.fn(() =>
          of([
            {
              time: 2.5,
              player: { shirtNumber: 20 },
              _links: { self: { href: 'self-link' } }
            } as SkillResult
          ])
        );

      component.playerChanged();
      tick(50); // delay from loading-delay-indicator

      expect(component.skillResult.player.shirtNumber).toBe(0);
      expect(component.loadingIndicator.isLoading).toBe(false);
      expect(showAlertDialogResultAlreadyExists).toHaveBeenCalledTimes(1);
    }));

    it('detects that a skill result for a player not yet exists', fakeAsync(() => {
      // result for this player doesn't yet exist
      skillResultsService.getSkillResultsBySkillAndTeamAndPlayerShirtNumber =
        jest.fn(() => of([]));

      component.playerChanged();
      tick(50); // delay from loading-delay-indicator

      expect(component.skillResult.player.shirtNumber).toBe(20);
      expect(component.loadingIndicator.isLoading).toBe(false);
      expect(showAlertDialogResultAlreadyExists).toHaveBeenCalledTimes(0);
    }));
  });
});
