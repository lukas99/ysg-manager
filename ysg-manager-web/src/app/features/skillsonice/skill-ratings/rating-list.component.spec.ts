import { RatingListComponent } from './rating-list.component';
import { SkillRatingsService } from '../../../core/services/skill-ratings.service';
import { SkillsOnIceStateService } from '../../../core/services/skills-on-ice-state.service';
import { Router } from '@angular/router';
import { Skill, SkillRating, SkillType, Team } from '../../../types';
import { SkillTypeService } from '../../../core/services/skill-type.service';
import { of } from 'rxjs';

describe('RatingListComponent', () => {
  let component: RatingListComponent;

  let stateService: SkillsOnIceStateService;
  let skillRatingsService: SkillRatingsService;
  let router: Router;

  beforeEach(() => {
    stateService = new SkillsOnIceStateService();
    skillRatingsService = <any>{
      getSkillRatingsBySkillAndTeam: jest.fn(() => of([])),
      setSelectedItem: jest.fn(),
      removeSelectedItem: jest.fn()
    };
    router = <any>{
      navigateByUrl: jest.fn()
    };

    component = new RatingListComponent(
      stateService,
      skillRatingsService,
      new SkillTypeService(),
      router
    );
  });

  describe('ngOnInit', () => {
    let skill: Skill;
    let team: Team;

    beforeEach(() => {
      skill = { typeForPlayers: SkillType.TIME_WITH_RATING } as Skill;

      stateService.setSelectedSkill(skill);
      stateService.setSelectedTeam(team);
    });

    it('sets the selected skill and team', () => {
      component.ngOnInit();

      expect(component.selectedSkill).toBe(skill);
      expect(component.selectedTeam).toBe(team);
    });

    it('should load the skill rating view records', () => {
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

      expect(
        skillRatingsService.getSkillRatingsBySkillAndTeam
      ).toHaveBeenCalledWith(skill, team);
      expect(component.skillRatings.length).toBe(3);
      expect(component.skillRatings[0]).toEqual(rating1);
      expect(component.skillRatings[1]).toEqual(rating2);
      expect(component.skillRatings[2]).toEqual(rating3);
    });
  });

  it('should edit a rating', () => {
    component.selectedSkill = {
      typeForPlayers: SkillType.TIME_WITH_RATING,
      name: 'Magic Transitions'
    } as Skill;
    const rating = {} as SkillRating;

    component.editRating(rating);

    expect(skillRatingsService.setSelectedItem).toHaveBeenCalledWith(rating);
    expect(router.navigateByUrl).toHaveBeenCalled();
  });

  it('should create a rating', () => {
    component.selectedSkill = {
      typeForPlayers: SkillType.TIME_WITH_RATING,
      name: 'Magic Transitions'
    } as Skill;

    component.createRating();

    expect(skillRatingsService.removeSelectedItem).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalled();
  });

  describe('navigateToDetailView', () => {
    it('should navigate to the page for skill Magic Transitions', () => {
      component.selectedSkill = {
        name: 'Magic Transitions',
        typeForPlayers: SkillType.TIME_WITH_RATING,
        typeForGoaltenders: SkillType.TIME_WITH_RATING
      } as Skill;
      component['navigateToDetailView']();
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        'skillsonice/ratingdetail'
      );
    });

    it('should navigate to the page for skill Best Shot', () => {
      component.selectedSkill = {
        typeForPlayers: SkillType.POINTS,
        typeForGoaltenders: SkillType.POINTS
      } as Skill;
      component['navigateToDetailView']();
      expect(router.navigateByUrl).toHaveBeenCalledTimes(0);
    });

    it('should navigate to the page for skill Pass and Go', () => {
      component.selectedSkill = {
        name: 'Pass and Go',
        typeForPlayers: SkillType.TIME_WITH_POINTS,
        typeForGoaltenders: SkillType.TIME_WITH_POINTS
      } as Skill;
      component['navigateToDetailView']();
      expect(router.navigateByUrl).toHaveBeenCalledTimes(0);
    });

    it('should navigate to the page for skill Controlled Jumble', () => {
      component.selectedSkill = {
        name: 'Controlled Jumble',
        typeForPlayers: SkillType.TIME,
        typeForGoaltenders: SkillType.RATING
      } as Skill;
      component['navigateToDetailView']();
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        'skillsonice/ratingdetail'
      );
    });

    it('should navigate to the page for skill Hit the Road', () => {
      component.selectedSkill = {
        name: 'hit the road',
        typeForPlayers: SkillType.TIME_WITH_RATING,
        typeForGoaltenders: SkillType.RATING
      } as Skill;
      component['navigateToDetailView']();
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        'skillsonice/ratingdetail'
      );
    });
  });
});
