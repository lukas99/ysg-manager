import { RatingListComponent } from './rating-list.component';
import { SkillRatingsService } from '../../../core/services/skill-ratings.service';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { Skill, SkillRating, SkillType, Team } from '../../../types';
import { SkillTypeService } from '../../../core/services/skill-type.service';
import { of } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';
import { SkillsService } from '../../../core/services/skills.service';
import { TeamsService } from '../../../core/services/teams.service';

describe('RatingListComponent', () => {
  let component: RatingListComponent;

  let skillsService: SkillsService;
  let teamsService: TeamsService;
  let skillRatingsService: SkillRatingsService;
  let router: Router;
  let route: ActivatedRoute;

  const team = { id: 11, name: 'EHC Engelberg' } as Team;
  const skill = { id: 22, typeForPlayers: SkillType.TIME_WITH_RATING } as Skill;
  const rating = { id: 40 } as SkillRating;

  beforeEach(() => {
    skillsService = <any>{ getSkill: jest.fn(() => of(skill)) };
    teamsService = <any>{ getTeam: jest.fn(() => of(team)) };
    skillRatingsService = <any>{
      getSkillRatingsBySkillAndTeam: jest.fn(() => of([])),
      setSelectedItem: jest.fn(),
      removeSelectedItem: jest.fn()
    };
    router = <any>{ navigate: jest.fn() };
    route = <any>{
      snapshot: {
        paramMap: convertToParamMap({ skillId: skill.id }),
        queryParamMap: convertToParamMap({ isSkillChef: 'true' })
      }
    };

    component = new RatingListComponent(
      skillsService,
      teamsService,
      skillRatingsService,
      new SkillTypeService(),
      router,
      route
    );
  });

  describe('ngOnInit', () => {
    it('sets the selected skill and team', fakeAsync(() => {
      component.ngOnInit();
      tick(50); // delay from loading-delay-indicator

      expect(component.selectedSkill).toBe(skill);
      expect(component.selectedTeam).toBe(team);
    }));

    it('should load the skill ratings', fakeAsync(() => {
      const rating1 = {
        score: 1,
        _links: { self: { href: 'ratings/1' } }
      } as SkillRating;
      const rating2 = {
        // is not yet uploaded (no self link)
        score: 2,
        _links: {}
      } as SkillRating;
      const rating3 = {
        score: 3,
        _links: { self: { href: 'ratings/1' } }
      } as SkillRating;
      skillRatingsService.getSkillRatingsBySkillAndTeam = jest.fn(() =>
        of([rating1, rating2, rating3])
      );

      component.ngOnInit();
      tick(50); // delay from loading-delay-indicator

      expect(
        skillRatingsService.getSkillRatingsBySkillAndTeam
      ).toHaveBeenCalledWith(skill, team);
      expect(component.skillRatings.length).toBe(3);
      expect(component.skillRatings[0]).toEqual(rating1);
      expect(component.skillRatings[1]).toEqual(rating2);
      expect(component.skillRatings[2]).toEqual(rating3);
      expect(component.loadingIndicator.isLoading).toBe(false);
    }));
  });

  it('should edit a rating', () => {
    component.selectedTeam = team;
    component.selectedSkill = {
      id: 30,
      typeForPlayers: SkillType.TIME_WITH_RATING,
      name: 'Magic Transitions'
    } as Skill;

    component.editRating(rating);

    expect(router.navigate).toHaveBeenCalledWith(
      [
        'skillsonice',
        'skills',
        30,
        'teams',
        team.id,
        'ratingdetail',
        rating.id
      ],
      { queryParamsHandling: 'merge' }
    );
  });

  it('should create a rating', () => {
    component.selectedTeam = team;
    component.selectedSkill = {
      id: 30,
      typeForPlayers: SkillType.TIME_WITH_RATING,
      name: 'Magic Transitions'
    } as Skill;

    component.createRating();

    expect(router.navigate).toHaveBeenCalledWith(
      ['skillsonice', 'skills', 30, 'teams', team.id, 'ratingdetail'],
      { queryParamsHandling: 'merge' }
    );
  });

  describe('navigateToDetailView', () => {
    beforeEach(() => {
      component.selectedTeam = team;
    });

    it('should navigate to the page for skill Magic Transitions', () => {
      component.selectedSkill = {
        id: 30,
        name: 'Magic Transitions',
        typeForPlayers: SkillType.TIME_WITH_RATING,
        typeForGoaltenders: SkillType.TIME_WITH_RATING
      } as Skill;
      component.editRating(rating);
      expect(router.navigate).toHaveBeenCalledWith(
        [
          'skillsonice',
          'skills',
          30,
          'teams',
          team.id,
          'ratingdetail',
          rating.id
        ],
        { queryParamsHandling: 'merge' }
      );
    });

    it('should navigate to the page for skill Best Shot', () => {
      component.selectedSkill = {
        id: 30,
        typeForPlayers: SkillType.POINTS,
        typeForGoaltenders: SkillType.POINTS
      } as Skill;
      component.editRating(rating);
      expect(router.navigate).toHaveBeenCalledTimes(0);
    });

    it('should navigate to the page for skill Pass and Go', () => {
      component.selectedSkill = {
        id: 30,
        name: 'Pass and Go',
        typeForPlayers: SkillType.TIME_WITH_POINTS,
        typeForGoaltenders: SkillType.TIME_WITH_POINTS
      } as Skill;
      component.editRating(rating);
      expect(router.navigate).toHaveBeenCalledTimes(0);
    });

    it('should navigate to the page for skill Controlled Jumble', () => {
      component.selectedSkill = {
        id: 30,
        name: 'Controlled Jumble',
        typeForPlayers: SkillType.TIME,
        typeForGoaltenders: SkillType.RATING
      } as Skill;
      component.editRating(rating);
      expect(router.navigate).toHaveBeenCalledWith(
        [
          'skillsonice',
          'skills',
          30,
          'teams',
          team.id,
          'ratingdetail',
          rating.id
        ],
        { queryParamsHandling: 'merge' }
      );
    });

    it('should navigate to the page for skill Hit the Road', () => {
      component.selectedSkill = {
        id: 30,
        name: 'hit the road',
        typeForPlayers: SkillType.TIME_WITH_RATING,
        typeForGoaltenders: SkillType.RATING
      } as Skill;
      component.editRating(rating);
      expect(router.navigate).toHaveBeenCalledWith(
        [
          'skillsonice',
          'skills',
          30,
          'teams',
          team.id,
          'ratingdetail',
          rating.id
        ],
        { queryParamsHandling: 'merge' }
      );
    });
  });
});
