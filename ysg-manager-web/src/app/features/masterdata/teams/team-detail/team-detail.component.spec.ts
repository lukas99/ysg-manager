import { TeamDetailComponent } from './team-detail.component';
import { TeamsService } from '../../../../core/services/teams.service';
import { fakeAsync } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

describe('TeamDetailComponent', () => {
  let component: TeamDetailComponent;
  let teamService: TeamsService;
  let formBuilder: FormBuilder;

  beforeEach(() => {
    teamService = <any>{};
    formBuilder = new FormBuilder();

    component = new TeamDetailComponent(teamService, formBuilder);
  });

  describe('the constructor', () => {
    it('creates the options', fakeAsync(() => {
      expect(component.crudDetailOptions.form).not.toBeNull();
      expect(component.crudDetailOptions.crudService).toBe(teamService);
      expect(component.crudDetailOptions.routerListUrl).toBe(
        '/masterdata/teams'
      );
    }));
  });
});
