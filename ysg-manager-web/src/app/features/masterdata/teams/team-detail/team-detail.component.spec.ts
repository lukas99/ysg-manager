import { TeamDetailComponent } from './team-detail.component';
import { TeamsService } from '../../../../core/services/teams.service';
import { fakeAsync } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

describe('TeamDetailComponent', () => {
  let component: TeamDetailComponent;
  let teamService: TeamsService;
  let formBuilder: FormBuilder;
  let router: Router;

  beforeEach(() => {
    teamService = <any>{};
    formBuilder = new FormBuilder();
    router = <any>{ navigateByUrl: jest.fn() };

    component = new TeamDetailComponent(teamService, formBuilder, router);
  });

  describe('the constructor', () => {
    it('creates the options', fakeAsync(() => {
      expect(component.crudDetailOptions.form).not.toBeNull();
      expect(component.crudDetailOptions.crudService).toBe(teamService);
      expect(component.crudDetailOptions.routerListUrl).toBe('/teams');
    }));
  });

  it('navigates to the players of a team', () => {
    component.navigateToPlayersOfTeam();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/players');
  });
});
