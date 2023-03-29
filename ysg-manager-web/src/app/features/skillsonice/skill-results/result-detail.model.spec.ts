import { ResultDetailForTimeComponent } from './result-detail-for-time.component';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
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
import { SkillsService } from '../../../core/services/skills.service';
import { TeamsService } from '../../../core/services/teams.service';

describe('ResultDetailModel', () => {
  let component: ResultDetailForTimeComponent;

  let skillsService: SkillsService;
  let teamsService: TeamsService;
  let skillResultsService: any;
  let router: Router;
  let route: ActivatedRoute;

  let selectedTeamLink: Link;
  let selectedSkillLink: Link;
  let selectedTeam: Team;
  let selectedSkill: Skill;
  let existingResult: SkillResult;

  let showAlertDialogResultAlreadyExists: any;

  beforeEach(() => {
    selectedTeamLink = {} as Link;
    selectedSkillLink = {} as Link;
    selectedTeam = { id: 11, _links: { self: selectedTeamLink } } as Team;
    selectedSkill = { id: 22, _links: { self: selectedSkillLink } } as Skill;
    existingResult = { id: 40 } as SkillResult;

    skillsService = <any>{ getSkill: jest.fn(() => of(selectedSkill)) };
    teamsService = <any>{ getTeam: jest.fn(() => of(selectedTeam)) };
    skillResultsService = <any>{
      getSkillResult: jest.fn(() => of()),
      deleteSkillResult: jest.fn(() => of({})),
      updateSkillResult: jest.fn(() => of({})),
      createSkillResult: jest.fn(() => of({})),
      // result for same player does not yet exist
      getSkillResultsBySkillAndTeamAndPlayerShirtNumber: jest.fn(() => of([]))
    };
    router = <any>{ navigate: jest.fn() };
    route = <any>{
      snapshot: {
        paramMap: convertToParamMap({
          skillId: selectedSkill.id,
          teamId: selectedTeam.id,
          resultId: existingResult.id
        })
      }
    };
    component = new ResultDetailForTimeComponent(
      skillsService,
      teamsService,
      skillResultsService,
      new SkillTypeService(),
      router,
      route
    );

    showAlertDialogResultAlreadyExists = jest.spyOn(
      component,
      'showAlertDialogResultForSkillAlreadyExists'
    );
    showAlertDialogResultAlreadyExists.mockImplementation(() => {});
  });

  describe('ngOnInit', () => {
    it('sets the selected skill and team', fakeAsync(() => {
      component.ngOnInit();
      tick(50); // delay from loading-delay-indicator

      expect(component.selectedTeam).toBe(selectedTeam);
      expect(component.selectedSkill).toBe(selectedSkill);
    }));

    describe('result exists', () => {
      beforeEach(() => {
        skillResultsService.getSkillResult = jest.fn(() => of(existingResult));
      });

      it('loads an existing result', fakeAsync(() => {
        component.ngOnInit();
        tick(50); // delay from loading-delay-indicator

        expect(component.skillResult).toBe(existingResult);
      }));

      it('disables the player position toggle', fakeAsync(() => {
        selectedSkill.name = 'Controlled Jumble';
        selectedSkill.typeForPlayers = SkillType.TIME;
        selectedSkill.typeForGoaltenders = SkillType.RATING;

        component.ngOnInit();
        tick(50); // delay from loading-delay-indicator

        expect(component.disablePlayerPositionToggle).toBeTruthy();
        expect(component.skillResult).toBe(existingResult);
      }));

      it('enables the player position toggle', fakeAsync(() => {
        selectedSkill.name = 'skillResult';
        selectedSkill.typeForPlayers = SkillType.TIME_WITH_RATING;
        selectedSkill.typeForGoaltenders = SkillType.TIME_WITH_RATING;

        component.ngOnInit();
        tick(50); // delay from loading-delay-indicator

        expect(component.disablePlayerPositionToggle).toBeFalsy();
        expect(component.skillResult).toBe(existingResult);
      }));
    });

    describe('new result', () => {
      beforeEach(() => {
        route = <any>{
          snapshot: {
            // without resultId
            paramMap: convertToParamMap({
              skillId: selectedSkill.id,
              teamId: selectedTeam.id
            })
          }
        };
        component = new ResultDetailForTimeComponent(
          skillsService,
          teamsService,
          skillResultsService,
          new SkillTypeService(),
          router,
          route
        );
      });

      it('initializes a new result', fakeAsync(() => {
        component.ngOnInit();
        tick(50); // delay from loading-delay-indicator

        expect(component.skillResult.time).toBe(0);
        expect(component.skillResult.failures).toBe(0);
        expect(component.skillResult.points).toBe(0);
        expect(component.skillResult.player.team).toBe(selectedTeam);
        expect(component.skillResult.player.position).toBe(
          PlayerPosition.SKATER
        );
        expect(component.skillResult.player._links.team).toBe(selectedTeamLink);
        expect(component.skillResult._links.skill).toBe(selectedSkillLink);
      }));

      it('disables the player position toggle and preselects the position value', fakeAsync(() => {
        selectedSkill.name = 'Controlled Jumble';
        selectedSkill.typeForPlayers = SkillType.TIME;
        selectedSkill.typeForGoaltenders = SkillType.RATING;

        component.ngOnInit();
        tick(50); // delay from loading-delay-indicator

        expect(component.disablePlayerPositionToggle).toBeTruthy();
        expect(component.skillResult.player.position).toBe(
          PlayerPosition.SKATER
        );
      }));

      it('enables the player position toggle', fakeAsync(() => {
        selectedSkill.name = 'skillResult';
        selectedSkill.typeForPlayers = SkillType.TIME_WITH_RATING;
        selectedSkill.typeForGoaltenders = SkillType.TIME_WITH_RATING;

        component.ngOnInit();
        tick(50); // delay from loading-delay-indicator

        expect(component.disablePlayerPositionToggle).toBeFalsy();
        expect(component.skillResult.player.position).toBe(
          PlayerPosition.SKATER
        );
      }));
    });
  });

  it('should delete a skill result', fakeAsync(() => {
    component.selectedSkill = selectedSkill;
    component.selectedTeam = selectedTeam;

    const skillResult = {} as SkillResult;
    component.skillResult = skillResult;
    skillResultsService.deleteSkillResult = jest.fn(() => of(skillResult));

    component.delete();
    tick(50); // delay from loading-delay-indicator

    expect(component.loadingIndicator.isLoading).toBe(false);
    expect(skillResultsService.deleteSkillResult).toHaveBeenCalledWith(
      skillResult
    );
    expect(router.navigate).toHaveBeenCalledWith(
      [
        'skillsonice',
        'skills',
        selectedSkill.id,
        'teams',
        selectedTeam.id,
        'results'
      ],
      { queryParamsHandling: 'merge' }
    );
  }));

  it('should cancel the skill result editing', () => {
    component.selectedSkill = selectedSkill;
    component.selectedTeam = selectedTeam;

    component.cancel();

    expect(router.navigate).toHaveBeenCalledWith(
      [
        'skillsonice',
        'skills',
        selectedSkill.id,
        'teams',
        selectedTeam.id,
        'results'
      ],
      { queryParamsHandling: 'merge' }
    );
  });

  describe('save', () => {
    beforeEach(() => {
      component.selectedSkill = selectedSkill;
      component.selectedTeam = selectedTeam;
    });

    it('should allow to update own result which already exists', fakeAsync(() => {
      const existingResult = {
        id: 40,
        time: 2.5,
        player: { shirtNumber: 20 },
        _links: { self: { href: 'self-link' } }
      } as SkillResult;
      component.skillResult = existingResult;
      // result for this player already exists (it's the result we want to update)
      skillResultsService.getSkillResultsBySkillAndTeamAndPlayerShirtNumber =
        jest.fn(() =>
          of([
            {
              id: 40,
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
      expect(component.loadingIndicator.isLoading).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(
        [
          'skillsonice',
          'skills',
          selectedSkill.id,
          'teams',
          selectedTeam.id,
          'results'
        ],
        { queryParamsHandling: 'merge' }
      );
    }));

    it('should prevent to update result to player which already exists', fakeAsync(() => {
      component.skillResult = {
        id: 40,
        time: 2.5,
        player: { shirtNumber: 20 },
        _links: { self: { href: 'self-link' } }
      } as SkillResult;
      // result for this player already exists (it's another result)
      skillResultsService.getSkillResultsBySkillAndTeamAndPlayerShirtNumber =
        jest.fn(() =>
          of([
            {
              id: 40,
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
      expect(component.loadingIndicator.isLoading).toBe(false);
      expect(router.navigate).toHaveBeenCalledTimes(0);
    }));

    it('should create new result', fakeAsync(() => {
      component.skillResult = { player: { shirtNumber: 20 } } as SkillResult;
      // result for this player doesn't yet exist
      skillResultsService.getSkillResultsBySkillAndTeamAndPlayerShirtNumber =
        jest.fn(() => of([]));

      component.save();
      tick(50); // delay from loading-delay-indicator

      expect(skillResultsService.createSkillResult).toHaveBeenCalledWith(
        component.skillResult,
        selectedSkill
      );
      expect(component.loadingIndicator.isLoading).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(
        [
          'skillsonice',
          'skills',
          selectedSkill.id,
          'teams',
          selectedTeam.id,
          'results'
        ],
        { queryParamsHandling: 'merge' }
      );
    }));

    it('should prevent to create a new result when a result already exists', fakeAsync(() => {
      component.skillResult = { player: { shirtNumber: 20 } } as SkillResult;
      // result for this player already exists
      skillResultsService.getSkillResultsBySkillAndTeamAndPlayerShirtNumber =
        jest.fn(() =>
          of([
            {
              id: 40,
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
      expect(component.loadingIndicator.isLoading).toBe(false);
      expect(router.navigate).toHaveBeenCalledTimes(0);
    }));
  });

  describe('playerChanged', () => {
    beforeEach(() => {
      // created new result
      component.skillResult = { player: { shirtNumber: 20 } } as SkillResult;
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
