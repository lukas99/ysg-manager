import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import {
  Link,
  PlayerPosition,
  Skill,
  SkillRating,
  SkillType,
  Team
} from '../../../types';
import { RatingDetailComponent } from './rating-detail.component';
import { SkillTypeService } from '../../../core/services/skill-type.service';
import { of } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';
import { SkillsService } from '../../../core/services/skills.service';
import { TeamsService } from '../../../core/services/teams.service';

describe('RatingDetailComponent', () => {
  let component: RatingDetailComponent;

  let skillsService: SkillsService;
  let teamsService: TeamsService;
  let skillRatingsService: any;
  let router: Router;
  let route: ActivatedRoute;

  let selectedTeamLink: Link;
  let selectedSkillLink: Link;
  let selectedTeam: Team;
  let selectedSkill: Skill;
  let existingRating: SkillRating;

  let showAlertDialogRatingAlreadyExists: any;

  beforeEach(() => {
    selectedTeamLink = {} as Link;
    selectedSkillLink = {} as Link;
    selectedTeam = { id: 11, _links: { self: selectedTeamLink } } as Team;
    selectedSkill = { id: 22, _links: { self: selectedSkillLink } } as Skill;
    existingRating = { id: 40 } as SkillRating;

    skillsService = <any>{ getSkill: jest.fn(() => of(selectedSkill)) };
    teamsService = <any>{ getTeam: jest.fn(() => of(selectedTeam)) };
    skillRatingsService = <any>{
      getSkillRating: jest.fn(() => of()),
      deleteSkillRating: jest.fn(() => of({})),
      updateSkillRating: jest.fn(() => of({})),
      createSkillRating: jest.fn(() => of({})),
      // rating for same player does not yet exist
      getSkillRatingsBySkillAndTeamAndPlayerShirtNumber: jest.fn(() => of([]))
    };
    router = <any>{ navigate: jest.fn() };
    route = <any>{
      snapshot: {
        paramMap: convertToParamMap({
          skillId: selectedSkill.id,
          teamId: selectedTeam.id,
          ratingId: existingRating.id
        })
      }
    };
    component = new RatingDetailComponent(
      skillsService,
      teamsService,
      skillRatingsService,
      new SkillTypeService(),
      router,
      route
    );

    showAlertDialogRatingAlreadyExists = jest.spyOn(
      component,
      'showAlertDialogRatingForSkillAlreadyExists'
    );
    showAlertDialogRatingAlreadyExists.mockImplementation(() => {});
  });

  describe('ngOnInit', () => {
    it('sets the selected skill and team', fakeAsync(() => {
      component.ngOnInit();
      tick(50); // delay from loading-delay-indicator

      expect(component.selectedTeam).toBe(selectedTeam);
      expect(component.selectedSkill).toBe(selectedSkill);
    }));

    describe('rating exists', () => {
      beforeEach(() => {
        skillRatingsService.getSkillRating = jest.fn(() => of(existingRating));
      });

      it('loads an existing rating', fakeAsync(() => {
        component.ngOnInit();
        tick(50); // delay from loading-delay-indicator

        expect(component.skillRating).toBe(existingRating);
      }));

      it('disables the player position toggle', fakeAsync(() => {
        selectedSkill.name = 'Controlled Jumble';
        selectedSkill.typeForPlayers = SkillType.TIME;
        selectedSkill.typeForGoaltenders = SkillType.RATING;

        component.ngOnInit();
        tick(50); // delay from loading-delay-indicator

        expect(component.disablePlayerPositionToggle).toBeTruthy();
        expect(component.skillRating).toBe(existingRating);
      }));

      it('enables the player position toggle', fakeAsync(() => {
        selectedSkill.name = 'Hit the Road';
        selectedSkill.typeForPlayers = SkillType.TIME_WITH_RATING;
        selectedSkill.typeForGoaltenders = SkillType.RATING;

        component.ngOnInit();
        tick(50); // delay from loading-delay-indicator

        expect(component.disablePlayerPositionToggle).toBeFalsy();
        expect(component.skillRating).toBe(existingRating);
      }));
    });

    describe('new rating', () => {
      beforeEach(() => {
        route = <any>{
          snapshot: {
            // without ratingId
            paramMap: convertToParamMap({
              skillId: selectedSkill.id,
              teamId: selectedTeam.id
            })
          }
        };
        component = new RatingDetailComponent(
          skillsService,
          teamsService,
          skillRatingsService,
          new SkillTypeService(),
          router,
          route
        );
      });

      it('initializes a new rating', fakeAsync(() => {
        component.ngOnInit();
        tick(50); // delay from loading-delay-indicator

        expect(component.skillRating.score).toBe(0);
        expect(component.skillRating.player.team).toBe(selectedTeam);
        expect(component.skillRating.player.position).toBe(
          PlayerPosition.SKATER
        );
        expect(component.skillRating.player._links.team).toBe(selectedTeamLink);
        expect(component.skillRating._links.skill).toBe(selectedSkillLink);
      }));

      it('disables the player position toggle and preselects the position value', fakeAsync(() => {
        selectedSkill.name = 'Controlled Jumble';
        selectedSkill.typeForPlayers = SkillType.TIME;
        selectedSkill.typeForGoaltenders = SkillType.RATING;

        component.ngOnInit();
        tick(50); // delay from loading-delay-indicator

        expect(component.disablePlayerPositionToggle).toBeTruthy();
        expect(component.skillRating.player.position).toBe(
          PlayerPosition.GOALTENDER
        );
      }));

      it('enables the player position toggle', fakeAsync(() => {
        selectedSkill.name = 'Hit the Road';
        selectedSkill.typeForPlayers = SkillType.TIME_WITH_RATING;
        selectedSkill.typeForGoaltenders = SkillType.RATING;

        component.ngOnInit();
        tick(50); // delay from loading-delay-indicator

        expect(component.disablePlayerPositionToggle).toBeFalsy();
        expect(component.skillRating.player.position).toBe(
          PlayerPosition.SKATER
        );
      }));
    });
  });

  it('should delete a skill rating', fakeAsync(() => {
    component.selectedSkill = selectedSkill;
    component.selectedTeam = selectedTeam;

    const skillRating = {} as SkillRating;
    component.skillRating = skillRating;
    skillRatingsService.deleteSkillRating = jest.fn(() => of(skillRating));

    component.delete();
    tick(50); // delay from loading-delay-indicator

    expect(skillRatingsService.deleteSkillRating).toHaveBeenCalledWith(
      skillRating
    );
    expect(component.loadingIndicator.isLoading).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(
      [
        'skillsonice',
        'skills',
        selectedSkill.id,
        'teams',
        selectedTeam.id,
        'ratings'
      ],
      { queryParamsHandling: 'merge' }
    );
  }));

  it('should cancel the skill rating editing', () => {
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
        'ratings'
      ],
      { queryParamsHandling: 'merge' }
    );
  });

  describe('save', () => {
    beforeEach(() => {
      component.selectedSkill = selectedSkill;
      component.selectedTeam = selectedTeam;
    });

    it('should allow to update own rating which already exists', fakeAsync(() => {
      const existingRating = {
        id: 40,
        score: 90,
        player: { shirtNumber: 20 },
        _links: { self: { href: 'self-link' } }
      } as SkillRating;
      component.skillRating = existingRating;
      // rating for this player already exists (it's the rating we want to update)
      skillRatingsService.getSkillRatingsBySkillAndTeamAndPlayerShirtNumber =
        jest.fn(() =>
          of([
            {
              id: 40,
              score: 90,
              player: { shirtNumber: 20 },
              _links: { self: { href: 'self-link' } }
            } as SkillRating
          ])
        );

      component.save();
      tick(50); // delay from loading-delay-indicator

      expect(skillRatingsService.updateSkillRating).toHaveBeenCalledWith(
        existingRating
      );
      expect(component.loadingIndicator.isLoading).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(
        [
          'skillsonice',
          'skills',
          selectedSkill.id,
          'teams',
          selectedTeam.id,
          'ratings'
        ],
        { queryParamsHandling: 'merge' }
      );
    }));

    it('should prevent to update rating to player which already exists', fakeAsync(() => {
      component.skillRating = {
        id: 40,
        score: 90,
        player: { shirtNumber: 20 },
        _links: { self: { href: 'self-link' } }
      } as SkillRating;
      // rating for this player already exists (it's another rating)
      skillRatingsService.getSkillRatingsBySkillAndTeamAndPlayerShirtNumber =
        jest.fn(() =>
          of([
            {
              id: 40,
              score: 90,
              player: { shirtNumber: 20 },
              _links: { self: { href: 'other-link' } }
            } as SkillRating
          ])
        );

      component.save();
      tick(50); // delay from loading-delay-indicator

      expect(showAlertDialogRatingAlreadyExists).toHaveBeenCalledTimes(1);

      expect(skillRatingsService.updateSkillRating).toHaveBeenCalledTimes(0);
      expect(skillRatingsService.createSkillRating).toHaveBeenCalledTimes(0);
      expect(component.loadingIndicator.isLoading).toBe(false);
      expect(router.navigate).toHaveBeenCalledTimes(0);
    }));

    it('should create new rating', fakeAsync(() => {
      component.skillRating = { player: { shirtNumber: 20 } } as SkillRating;
      // rating for this player doesn't yet exist
      skillRatingsService.getSkillRatingsBySkillAndTeamAndPlayerShirtNumber =
        jest.fn(() => of([]));

      component.save();
      tick(50); // delay from loading-delay-indicator

      expect(skillRatingsService.createSkillRating).toHaveBeenCalledWith(
        component.skillRating,
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
          'ratings'
        ],
        { queryParamsHandling: 'merge' }
      );
    }));

    it('should prevent to create a new rating when a rating already exists', fakeAsync(() => {
      component.skillRating = { player: { shirtNumber: 20 } } as SkillRating;
      // rating for this player already exists
      skillRatingsService.getSkillRatingsBySkillAndTeamAndPlayerShirtNumber =
        jest.fn(() =>
          of([
            {
              score: 90,
              player: { shirtNumber: 20 },
              _links: { self: { href: 'self-link' } }
            } as SkillRating
          ])
        );

      component.save();
      tick(50); // delay from loading-delay-indicator

      expect(showAlertDialogRatingAlreadyExists).toHaveBeenCalledTimes(1);

      expect(skillRatingsService.updateSkillRating).toHaveBeenCalledTimes(0);
      expect(skillRatingsService.createSkillRating).toHaveBeenCalledTimes(0);
      expect(component.loadingIndicator.isLoading).toBe(false);
      expect(router.navigate).toHaveBeenCalledTimes(0);
    }));
  });

  describe('playerChanged', () => {
    beforeEach(() => {
      // created new rating
      component.skillRating = { player: { shirtNumber: 20 } } as SkillRating;
    });

    it('detects that a skill rating for a player already exists', fakeAsync(() => {
      // rating for this player already exists
      skillRatingsService.getSkillRatingsBySkillAndTeamAndPlayerShirtNumber =
        jest.fn(() =>
          of([
            {
              score: 90,
              player: { shirtNumber: 20 },
              _links: { self: { href: 'self-link' } }
            } as SkillRating
          ])
        );

      component.playerChanged();
      tick(50); // delay from loading-delay-indicator

      expect(component.skillRating.player.shirtNumber).toBe(0);
      expect(component.loadingIndicator.isLoading).toBe(false);
      expect(showAlertDialogRatingAlreadyExists).toHaveBeenCalledTimes(1);
    }));

    it('detects that a skill rating for a player not yet exists', fakeAsync(() => {
      // rating for this player doesn't yet exist
      skillRatingsService.getSkillRatingsBySkillAndTeamAndPlayerShirtNumber =
        jest.fn(() => of([]));

      component.playerChanged();
      tick(50); // delay from loading-delay-indicator

      expect(component.skillRating.player.shirtNumber).toBe(20);
      expect(component.loadingIndicator.isLoading).toBe(false);
      expect(showAlertDialogRatingAlreadyExists).toHaveBeenCalledTimes(0);
    }));
  });
});
