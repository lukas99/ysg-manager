import { TournamentDetailComponent } from './tournament-detail.component';
import { TournamentsService } from '../../../../core/services/tournaments.service';
import { fakeAsync } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

describe('TournamentDetailComponent', () => {
  let component: TournamentDetailComponent;
  let tournamentService: TournamentsService;
  let formBuilder: FormBuilder;

  beforeEach(() => {
    tournamentService = <any>{};
    formBuilder = new FormBuilder();

    component = new TournamentDetailComponent(tournamentService, formBuilder);
  });

  describe('the constructor', () => {
    it('creates the options', fakeAsync(() => {
      expect(component.crudDetailOptions.form).not.toBeNull();
      expect(component.crudDetailOptions.crudService).toBe(tournamentService);
      expect(component.crudDetailOptions.routerListUrl).toBe(
        '/masterdata/tournaments'
      );
    }));
  });
});
