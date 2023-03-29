import { TeamSelectionComponent } from './team-selection.component';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { Skill, Team } from '../../../types';
import { of } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';

describe('TeamSelectionComponent', () => {
  let component: TeamSelectionComponent;

  let teamsService: any;
  let router: Router;
  let route: ActivatedRoute;

  const skill = { id: 25, name: 'Magic Transitions' } as Skill;

  const ehcEngelberg = { id: 1, name: 'EHC Engelberg' } as Team;
  const hcLuzern = { id: 2, name: 'HC Luzern' } as Team;
  const teams = [ehcEngelberg, hcLuzern];

  beforeEach(() => {
    teamsService = <any>{ getTeams: jest.fn() };
    router = <any>{ navigate: jest.fn() };
    route = <any>{
      snapshot: {
        paramMap: convertToParamMap({ skillId: skill.id }),
        queryParamMap: convertToParamMap({ isSkillChef: 'true' })
      }
    };

    component = new TeamSelectionComponent(teamsService, router, route);
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      const teamsObservable = of(teams);
      teamsService.getTeams = jest.fn(() => teamsObservable);
    });

    it('sets fields selectedSkillId and isSkillChef', () => {
      component.ngOnInit();
      expect(component.selectedSkillId).toBe(skill.id);
      expect(component.isSkillChef).toBeTruthy();
    });

    it('loads the teams', fakeAsync(() => {
      component.ngOnInit();
      tick(50); // delay from loading-delay-indicator

      expect(component.teams).toEqual(teams);
      expect(component.loadingIndicator.isLoading).toEqual(false);
    }));
  });

  describe('navigate', () => {
    it('skill chef selects a team and navigates to the result list', () => {
      component.selectedSkillId = String(skill.id);
      component.isSkillChef = true;

      component.teamSelected(ehcEngelberg);

      expect(router.navigate).toHaveBeenCalledWith(
        [
          'skillsonice',
          'skills',
          String(skill.id),
          'teams',
          ehcEngelberg.id,
          'results'
        ],
        { queryParamsHandling: 'merge' }
      );
    });

    it('skill expert selects a team and navigates to the rating list', () => {
      component.selectedSkillId = String(skill.id);
      component.isSkillChef = false;

      component.teamSelected(ehcEngelberg);

      expect(router.navigate).toHaveBeenCalledWith(
        [
          'skillsonice',
          'skills',
          String(skill.id),
          'teams',
          ehcEngelberg.id,
          'ratings'
        ],
        { queryParamsHandling: 'merge' }
      );
    });
  });
});
