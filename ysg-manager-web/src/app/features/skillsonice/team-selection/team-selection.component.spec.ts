import { TeamSelectionComponent } from './team-selection.component';
import { SkillsOnIceStateService } from '../../../core/services/skills-on-ice-state.service';
import { Router } from '@angular/router';
import { Team } from '../../../types';
import { of } from 'rxjs';

describe('TeamSelectionComponent', () => {
  let component: TeamSelectionComponent;

  let teamsService: any;
  let stateService: SkillsOnIceStateService;
  let router: Router;

  const ehcEngelberg = { name: 'EHC Engelberg' } as Team;
  const hcLuzern = { name: 'HC Luzern' } as Team;
  const teams = [ehcEngelberg, hcLuzern];

  beforeEach(() => {
    teamsService = <any>{ getTeams: jest.fn() };
    stateService = new SkillsOnIceStateService();
    router = <any>{ navigateByUrl: jest.fn() };

    component = new TeamSelectionComponent(teamsService, stateService, router);
  });

  it('loads the teams', () => {
    const teamsObservable = of(teams);
    teamsService.getTeams = jest.fn(() => teamsObservable);

    component.ngOnInit();

    expect(component.teams$).toEqual(teamsObservable);
  });

  describe('navigate', () => {
    it('skill chef selects a team and navigates to the result list', () => {
      stateService.setSkillChef(true);

      component.teamSelected(ehcEngelberg);

      expect(stateService.getSelectedTeam()).toEqual(ehcEngelberg);
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        'skillsonice/resultlist'
      );
    });

    it('skill expert selects a team and navigates to the rating list', () => {
      stateService.setSkillChef(false);

      component.teamSelected(ehcEngelberg);

      expect(stateService.getSelectedTeam()).toEqual(ehcEngelberg);
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        'skillsonice/ratinglist'
      );
    });
  });
});
