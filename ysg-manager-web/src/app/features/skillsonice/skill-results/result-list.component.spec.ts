import { ResultListComponent } from './result-list.component';
import { SkillResultsService } from '../../../core/services/skill-results.service';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { Skill, SkillResult, SkillType, Team } from '../../../types';
import { SkillTypeService } from '../../../core/services/skill-type.service';
import { of } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';
import { SkillsService } from '../../../core/services/skills.service';
import { TeamsService } from '../../../core/services/teams.service';

describe('ResultListComponent', () => {
  let component: ResultListComponent;

  let skillsService: SkillsService;
  let teamsService: TeamsService;
  let skillResultsService: SkillResultsService;
  let router: Router;
  let route: ActivatedRoute;

  const team = { id: 11, name: 'EHC Engelberg' } as Team;
  const skill = { id: 22, typeForPlayers: SkillType.TIME_WITH_POINTS } as Skill;
  const result = { id: 40 } as SkillResult;

  beforeEach(() => {
    skillsService = <any>{ getSkill: jest.fn(() => of(skill)) };
    teamsService = <any>{ getTeam: jest.fn(() => of(team)) };
    skillResultsService = <any>{
      getSkillResultsBySkillAndTeam: jest.fn(() => of([]))
    };
    router = <any>{ navigate: jest.fn() };
    route = <any>{
      snapshot: {
        paramMap: convertToParamMap({ skillId: skill.id }),
        queryParamMap: convertToParamMap({ isSkillChef: 'true' })
      }
    };

    component = new ResultListComponent(
      skillsService,
      teamsService,
      skillResultsService,
      new SkillTypeService(),
      router,
      route
    );
  });

  describe('ngOnInit', () => {
    it('loads the selected skill and team', fakeAsync(() => {
      component.ngOnInit();
      tick(50); // delay from loading-delay-indicator

      expect(component.selectedSkill).toBe(skill);
      expect(component.selectedTeam).toBe(team);
    }));

    it('should set showTime and showPoints to true', fakeAsync(() => {
      component.ngOnInit();
      tick(50); // delay from loading-delay-indicator

      expect(component.showTime).toBeTruthy();
      expect(component.showPoints).toBeTruthy();
    }));

    it('should load the skill results', fakeAsync(() => {
      const result1 = {
        points: 1,
        _links: { self: { href: 'results/1' } }
      } as SkillResult;
      const result2 = {
        points: 2,
        _links: {}
      } as SkillResult; // is not yet uploaded (no self link)
      const result3 = {
        points: 3,
        _links: { self: { href: 'results/1' } }
      } as SkillResult;
      skillResultsService.getSkillResultsBySkillAndTeam = jest.fn(() =>
        of([result1, result2, result3])
      );

      component.ngOnInit();
      tick(50); // delay from loading-delay-indicator

      expect(
        skillResultsService.getSkillResultsBySkillAndTeam
      ).toHaveBeenCalledWith(skill, team);
      expect(component.skillResults.length).toBe(3);
      expect(component.skillResults[0]).toEqual(result1);
      expect(component.skillResults[1]).toEqual(result2);
      expect(component.skillResults[2]).toEqual(result3);
      expect(component.loadingIndicator.isLoading).toBe(false);
    }));
  });

  it('should edit a result', () => {
    component.selectedTeam = team;
    component.selectedSkill = {
      id: 30,
      typeForPlayers: SkillType.TIME_WITH_RATING,
      name: 'Magic Transitions'
    } as Skill;

    component.editResult(result);

    expect(router.navigate).toHaveBeenCalledWith(
      [
        'skillsonice',
        'skills',
        30,
        'teams',
        team.id,
        'resultdetailfortime',
        result.id
      ],
      { queryParamsHandling: 'merge' }
    );
  });

  it('should create a result', () => {
    component.selectedTeam = team;
    component.selectedSkill = {
      id: 30,
      typeForPlayers: SkillType.TIME_WITH_RATING,
      name: 'Magic Transitions'
    } as Skill;

    component.createResult();

    expect(router.navigate).toHaveBeenCalledWith(
      ['skillsonice', 'skills', 30, 'teams', team.id, 'resultdetailfortime'],
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
        typeForPlayers: SkillType.TIME_WITH_RATING
      } as Skill;
      component.editResult(result);
      expect(router.navigate).toHaveBeenCalledWith(
        [
          'skillsonice',
          'skills',
          30,
          'teams',
          team.id,
          'resultdetailfortime',
          result.id
        ],
        { queryParamsHandling: 'merge' }
      );
    });

    it('should navigate to the page for skill Best Shot', () => {
      component.selectedSkill = {
        id: 30,
        typeForPlayers: SkillType.POINTS
      } as Skill;
      component.editResult(result);
      expect(router.navigate).toHaveBeenCalledWith(
        [
          'skillsonice',
          'skills',
          30,
          'teams',
          team.id,
          'resultdetailforpoints',
          result.id
        ],
        { queryParamsHandling: 'merge' }
      );
    });

    it('should navigate to the page for skill Pass and Go', () => {
      component.selectedSkill = {
        id: 30,
        name: 'Pass and Go',
        typeForPlayers: SkillType.TIME_WITH_POINTS
      } as Skill;
      component.editResult(result);
      expect(router.navigate).toHaveBeenCalledWith(
        [
          'skillsonice',
          'skills',
          30,
          'teams',
          team.id,
          'resultdetailfortimewithpoints',
          result.id
        ],
        { queryParamsHandling: 'merge' }
      );
    });

    it('should navigate to the page for skill Controlled Jumble', () => {
      component.selectedSkill = {
        id: 30,
        name: 'Controlled Jumble',
        typeForPlayers: SkillType.TIME
      } as Skill;
      component.editResult(result);
      expect(router.navigate).toHaveBeenCalledWith(
        [
          'skillsonice',
          'skills',
          30,
          'teams',
          team.id,
          'resultdetailfortime',
          result.id
        ],
        { queryParamsHandling: 'merge' }
      );
    });

    it('should navigate to the page for skill Hit the Road', () => {
      component.selectedSkill = {
        id: 30,
        name: 'hit the road',
        typeForPlayers: SkillType.TIME_WITH_RATING
      } as Skill;
      component.editResult(result);
      expect(router.navigate).toHaveBeenCalledWith(
        [
          'skillsonice',
          'skills',
          30,
          'teams',
          team.id,
          'resultdetailfortimemanual',
          result.id
        ],
        { queryParamsHandling: 'merge' }
      );
    });
  });
});
