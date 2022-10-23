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

  beforeEach(() => {
    teamsService = <any>{ getTeams: jest.fn() };
    stateService = <any>{ setSelectedTeam: jest.fn() };
    router = <any>{ navigateByUrl: jest.fn() };

    component = new TeamSelectionComponent(teamsService, stateService, router);
  });

  it('loads the teams', () => {
    const teams = [
      { name: 'EHC Engelberg' } as Team,
      { name: 'HC Luzern' } as Team
    ];
    const teamsObservable = of(teams);
    teamsService.getTeams = jest.fn(() => teamsObservable);

    component.ngOnInit();

    expect(component.teams$).toEqual(teamsObservable);
  });

  it('selects a team', () => {
    const team = {} as Team;

    component.teamSelected(team);

    expect(stateService.setSelectedTeam).toHaveBeenCalledWith(team);
    expect(router.navigateByUrl).toHaveBeenCalledWith('skillsonice/todo');
  });
});
