import { SkillsOnIceStateService } from '../../../core/services/skills-on-ice-state.service';
import { SkillRatingsService } from '../../../core/services/skill-ratings.service';
import { Router } from '@angular/router';
import {
  Link,
  PlayerPosition,
  Skill,
  SkillRating,
  SkillType,
  Team
} from '../../../types';
import { HttpClient } from '@angular/common/http';
import { SkillsService } from '../../../core/services/skills.service';
import { SkillScoresService } from '../../../core/services/skill-scores.service';
import { CacheService } from '../../../core/services/cache.service';
import { RatingDetailComponent } from './rating-detail.component';
import { SkillTypeService } from '../../../core/services/skill-type.service';

describe('RatingDetailComponent', () => {
  let component: RatingDetailComponent;
  let stateService: SkillsOnIceStateService;
  let skillRatingsService: SkillRatingsService;
  let cacheService: CacheService<SkillRating>;
  let router: Router;

  let removeSkillFromCache: any;
  let removeSelectedSkill: any;
  let updateSkillRatingInCache: any;
  let addSkillRatingToCache: any;
  let getCachedSkillRating: any;

  let selectedTeamLink: Link;
  let selectedSkillLink: Link;
  let selectedTeam: Team;
  let selectedSkill: Skill;

  let showAlertDialogRatingAlreadyExists: any;

  beforeEach(() => {
    stateService = new SkillsOnIceStateService();
    cacheService = <any>{
      addToCache: jest.fn(),
      updateInCache: jest.fn(),
      removeFromCache: jest.fn()
    };
    skillRatingsService = new SkillRatingsService(
      {} as HttpClient,
      {} as SkillsService,
      new SkillScoresService<SkillRating>(cacheService)
    );
    removeSkillFromCache = jest.spyOn(
      skillRatingsService,
      'removeSkillRatingFromCache'
    );
    removeSelectedSkill = jest.spyOn(skillRatingsService, 'removeSelectedItem');
    updateSkillRatingInCache = jest.spyOn(
      skillRatingsService,
      'updateSkillRatingInCache'
    );
    addSkillRatingToCache = jest.spyOn(
      skillRatingsService,
      'addSkillRatingToCache'
    );
    getCachedSkillRating = jest.spyOn(
      skillRatingsService,
      'getCachedSkillRating'
    );
    // rating for same player does not yet exist in cache
    getCachedSkillRating.mockImplementation(() => {});

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
      component.ngOnInit();
      expect(component.selectedTeam).toBe(selectedTeam);
      expect(component.selectedSkill).toBe(selectedSkill);
    });

    describe('rating exists', () => {
      let existingRating: SkillRating;

      beforeEach(() => {
        existingRating = { score: 80 } as SkillRating;
        skillRatingsService.setSelectedItem(existingRating);
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

  it('should delete a skill rating', () => {
    const skillRating = {} as SkillRating;
    component.skillRating = skillRating;

    component.delete();

    expect(removeSkillFromCache).toHaveBeenCalledWith(skillRating);
    expect(removeSelectedSkill).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('skillsonice/ratinglist');
  });

  it('should cancel the skill rating editing', () => {
    component.cancel();

    expect(removeSelectedSkill).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('skillsonice/ratinglist');
  });

  describe('save', () => {
    it('should allow to update own rating which already exists in cache', () => {
      const existingRating = { score: 80, cacheId: '9999' } as SkillRating;
      skillRatingsService.setSelectedItem(existingRating);
      component.ngOnInit();
      // rating for this player already exists in cache (it's the rating we want to update)
      getCachedSkillRating.mockImplementation(
        () => ({ score: 80, cacheId: '9999' } as SkillRating)
      );

      component.save();

      expect(skillRatingsService.updateSkillRatingInCache).toHaveBeenCalledWith(
        existingRating
      );
      expect(removeSelectedSkill).toHaveBeenCalled();
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        'skillsonice/ratinglist'
      );
    });

    it('should prevent to update rating to player which already exists in cache', () => {
      const existingRating = { score: 80, cacheId: '9999' } as SkillRating;
      skillRatingsService.setSelectedItem(existingRating);
      component.ngOnInit();
      // rating for this player already exists in cache (it's another rating)
      getCachedSkillRating.mockImplementation(
        () => ({ score: 80, cacheId: '8888' } as SkillRating)
      );

      component.save();

      expect(showAlertDialogRatingAlreadyExists).toHaveBeenCalledTimes(1);

      expect(
        skillRatingsService.updateSkillRatingInCache
      ).toHaveBeenCalledTimes(0);
      expect(skillRatingsService.addSkillRatingToCache).toHaveBeenCalledTimes(
        0
      );
      expect(removeSelectedSkill).toHaveBeenCalledTimes(0);
      expect(router.navigateByUrl).toHaveBeenCalledTimes(0);
    });

    it('should create new rating', () => {
      expect(skillRatingsService.getSelectedItemValue()).toEqual({});
      component.ngOnInit();

      component.save();

      expect(skillRatingsService.addSkillRatingToCache).toHaveBeenCalledWith(
        component.skillRating
      );
      expect(removeSelectedSkill).toHaveBeenCalled();
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        'skillsonice/ratinglist'
      );
    });

    it('should prevent to create a new rating when a rating already exists in cache', () => {
      expect(skillRatingsService.getSelectedItemValue()).toEqual({});
      component.ngOnInit();
      // rating for this player already exists in cache
      getCachedSkillRating.mockImplementation(() => ({} as SkillRating));

      component.save();

      expect(showAlertDialogRatingAlreadyExists).toHaveBeenCalledTimes(1);

      expect(
        skillRatingsService.updateSkillRatingInCache
      ).toHaveBeenCalledTimes(0);
      expect(skillRatingsService.addSkillRatingToCache).toHaveBeenCalledTimes(
        0
      );
      expect(removeSelectedSkill).toHaveBeenCalledTimes(0);
      expect(router.navigateByUrl).toHaveBeenCalledTimes(0);
    });
  });

  describe('playerChanged', () => {
    beforeEach(() => {
      // create new rating
      expect(skillRatingsService.getSelectedItemValue()).toEqual({});
      component.ngOnInit();
      // set shirt number
      component.skillRating.player.shirtNumber = 20;
    });

    it('detects that a skill rating for a player already exists', () => {
      // rating for this player already exists in cache
      getCachedSkillRating.mockImplementation(() => ({} as SkillRating));

      component.playerChanged();

      expect(component.skillRating.player.shirtNumber).toBe(0);
      expect(showAlertDialogRatingAlreadyExists).toHaveBeenCalledTimes(1);
    });

    it('detects that a skill rating for a player not yet exists', () => {
      // rating for this player already exists in cache
      getCachedSkillRating.mockImplementation(() => null);

      component.playerChanged();

      expect(component.skillRating.player.shirtNumber).toBe(20);
      expect(showAlertDialogRatingAlreadyExists).toHaveBeenCalledTimes(0);
    });
  });
});
