import { SkillsOnIceStateService } from '../../../core/services/skills-on-ice-state.service';
import { Router } from '@angular/router';
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

describe('RatingDetailComponent', () => {
  let component: RatingDetailComponent;
  let stateService: SkillsOnIceStateService;
  let skillRatingsService: any;
  let router: Router;

  let selectedTeamLink: Link;
  let selectedSkillLink: Link;
  let selectedTeam: Team;
  let selectedSkill: Skill;

  let showAlertDialogRatingAlreadyExists: any;

  beforeEach(() => {
    stateService = new SkillsOnIceStateService();
    skillRatingsService = <any>{
      // no item is selected -> would create new item
      getSelectedItemValue: jest.fn(() => {
        return {};
      }),
      deleteSkillRating: jest.fn(() => of({})),
      removeSelectedItem: jest.fn(),
      updateSkillRating: jest.fn(() => of({})),
      createSkillRating: jest.fn(() => of({})),
      // rating for same player does not yet exist
      getSkillRatingsBySkillAndTeamAndPlayerShirtNumber: jest.fn(() => of([]))
    };
    router = <any>{ navigateByUrl: jest.fn() };
    component = new RatingDetailComponent(
      stateService,
      skillRatingsService,
      new SkillTypeService(),
      router
    );

    selectedTeamLink = {} as Link;
    selectedSkillLink = {} as Link;
    selectedTeam = { _links: { self: selectedTeamLink } } as Team;
    selectedSkill = { _links: { self: selectedSkillLink } } as Skill;
    stateService.setSelectedTeam(selectedTeam);
    stateService.setSelectedSkill(selectedSkill);

    showAlertDialogRatingAlreadyExists = jest.spyOn(
      component,
      'showAlertDialogRatingForSkillAlreadyExists'
    );
    showAlertDialogRatingAlreadyExists.mockImplementation(() => {});
  });

  describe('ngOnInit', () => {
    it('sets the selected skill and team', () => {
      const existingRating = { score: 80 } as SkillRating;
      skillRatingsService.getSelectedItemValue = jest.fn(() => existingRating);

      component.ngOnInit();

      expect(component.selectedTeam).toBe(selectedTeam);
      expect(component.selectedSkill).toBe(selectedSkill);
    });

    describe('rating exists', () => {
      let existingRating: SkillRating;

      beforeEach(() => {
        existingRating = { score: 80 } as SkillRating;
        skillRatingsService.getSelectedItemValue = jest.fn(
          () => existingRating
        );
      });

      it('loads an existing rating', () => {
        component.ngOnInit();
        expect(component.skillRating).toBe(existingRating);
      });

      it('disables the player position toggle', () => {
        selectedSkill.name = 'Controlled Jumble';
        selectedSkill.typeForPlayers = SkillType.TIME;
        selectedSkill.typeForGoaltenders = SkillType.RATING;
        stateService.setSelectedSkill(selectedSkill);

        component.ngOnInit();

        expect(component.disablePlayerPositionToggle).toBeTruthy();
        expect(component.skillRating).toBe(existingRating);
      });

      it('enables the player position toggle', () => {
        selectedSkill.name = 'Hit the Road';
        selectedSkill.typeForPlayers = SkillType.TIME_WITH_RATING;
        selectedSkill.typeForGoaltenders = SkillType.RATING;
        stateService.setSelectedSkill(selectedSkill);

        component.ngOnInit();

        expect(component.disablePlayerPositionToggle).toBeFalsy();
        expect(component.skillRating).toBe(existingRating);
      });
    });

    describe('new rating', () => {
      beforeEach(() => {
        expect(skillRatingsService.getSelectedItemValue()).toEqual({});
      });

      it('initializes a new rating', () => {
        component.ngOnInit();

        expect(component.skillRating.score).toBe(0);
        expect(component.skillRating.player.team).toBe(selectedTeam);
        expect(component.skillRating.player.position).toBe(
          PlayerPosition.SKATER
        );
        expect(component.skillRating.player._links.team).toBe(selectedTeamLink);
        expect(component.skillRating._links.skill).toBe(selectedSkillLink);
      });

      it('disables the player position toggle and preselects the position value', () => {
        selectedSkill.name = 'Controlled Jumble';
        selectedSkill.typeForPlayers = SkillType.TIME;
        selectedSkill.typeForGoaltenders = SkillType.RATING;
        stateService.setSelectedSkill(selectedSkill);

        component.ngOnInit();

        expect(component.disablePlayerPositionToggle).toBeTruthy();
        expect(component.skillRating.player.position).toBe(
          PlayerPosition.GOALTENDER
        );
      });

      it('enables the player position toggle', () => {
        selectedSkill.name = 'Hit the Road';
        selectedSkill.typeForPlayers = SkillType.TIME_WITH_RATING;
        selectedSkill.typeForGoaltenders = SkillType.RATING;
        stateService.setSelectedSkill(selectedSkill);

        component.ngOnInit();

        expect(component.disablePlayerPositionToggle).toBeFalsy();
        expect(component.skillRating.player.position).toBe(
          PlayerPosition.SKATER
        );
      });
    });
  });

  it('should delete a skill rating', fakeAsync(() => {
    const skillRating = {} as SkillRating;
    component.skillRating = skillRating;
    skillRatingsService.deleteSkillRating = jest.fn(() => of(skillRating));

    component.delete();
    tick(50); // delay from loading-delay-indicator

    expect(skillRatingsService.deleteSkillRating).toHaveBeenCalledWith(
      skillRating
    );
    expect(skillRatingsService.removeSelectedItem).toHaveBeenCalled();
    expect(component.loadingIndicator.isLoading).toBe(false);
    expect(router.navigateByUrl).toHaveBeenCalledWith('skillsonice/ratinglist');
  }));

  it('should cancel the skill rating editing', () => {
    component.cancel();

    expect(skillRatingsService.removeSelectedItem).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('skillsonice/ratinglist');
  });

  describe('save', () => {
    it('should allow to update own rating which already exists', fakeAsync(() => {
      const existingRating = {
        score: 90,
        player: { shirtNumber: 20 },
        _links: { self: { href: 'self-link' } }
      } as SkillRating;
      skillRatingsService.getSelectedItemValue = jest.fn(() => existingRating);
      component.ngOnInit();
      // rating for this player already exists (it's the rating we want to update)
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

      expect(skillRatingsService.updateSkillRating).toHaveBeenCalledWith(
        existingRating
      );
      expect(skillRatingsService.removeSelectedItem).toHaveBeenCalled();
      expect(component.loadingIndicator.isLoading).toBe(false);
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        'skillsonice/ratinglist'
      );
    }));

    it('should prevent to update rating to player which already exists', fakeAsync(() => {
      const existingRating = {
        score: 90,
        player: { shirtNumber: 20 },
        _links: { self: { href: 'self-link' } }
      } as SkillRating;
      skillRatingsService.getSelectedItemValue = jest.fn(() => existingRating);
      component.ngOnInit();
      // rating for this player already exists (it's another rating)
      skillRatingsService.getSkillRatingsBySkillAndTeamAndPlayerShirtNumber =
        jest.fn(() =>
          of([
            {
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
      expect(skillRatingsService.removeSelectedItem).toHaveBeenCalledTimes(0);
      expect(component.loadingIndicator.isLoading).toBe(false);
      expect(router.navigateByUrl).toHaveBeenCalledTimes(0);
    }));

    it('should create new rating', fakeAsync(() => {
      expect(skillRatingsService.getSelectedItemValue()).toEqual({});
      component.ngOnInit();
      // rating for this player doesn't yet exist
      skillRatingsService.getSkillRatingsBySkillAndTeamAndPlayerShirtNumber =
        jest.fn(() => of([]));

      component.save();
      tick(50); // delay from loading-delay-indicator

      expect(skillRatingsService.createSkillRating).toHaveBeenCalledWith(
        component.skillRating,
        selectedSkill
      );
      expect(skillRatingsService.removeSelectedItem).toHaveBeenCalled();
      expect(component.loadingIndicator.isLoading).toBe(false);
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        'skillsonice/ratinglist'
      );
    }));

    it('should prevent to create a new rating when a rating already exists', fakeAsync(() => {
      expect(skillRatingsService.getSelectedItemValue()).toEqual({});
      component.ngOnInit();
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
      expect(skillRatingsService.removeSelectedItem).toHaveBeenCalledTimes(0);
      expect(component.loadingIndicator.isLoading).toBe(false);
      expect(router.navigateByUrl).toHaveBeenCalledTimes(0);
    }));
  });

  describe('playerChanged', () => {
    beforeEach(() => {
      // create new rating
      expect(skillRatingsService.getSelectedItemValue()).toEqual({});
      component.ngOnInit();
      // set shirt number
      component.skillRating.player.shirtNumber = 20;
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
      expect(showAlertDialogRatingAlreadyExists).toHaveBeenCalledTimes(1);
      expect(component.loadingIndicator.isLoading).toBe(false);
    }));

    it('detects that a skill rating for a player not yet exists', fakeAsync(() => {
      // rating for this player doesn't yet exist
      skillRatingsService.getSkillRatingsBySkillAndTeamAndPlayerShirtNumber =
        jest.fn(() => of([]));

      component.playerChanged();
      tick(50); // delay from loading-delay-indicator

      expect(component.skillRating.player.shirtNumber).toBe(20);
      expect(showAlertDialogRatingAlreadyExists).toHaveBeenCalledTimes(0);
      expect(component.loadingIndicator.isLoading).toBe(false);
    }));
  });
});
