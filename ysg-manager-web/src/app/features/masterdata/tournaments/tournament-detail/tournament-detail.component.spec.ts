import { TournamentDetailComponent } from './tournament-detail.component';
import { TournamentsService } from '../../../../core/services/tournaments.service';
import { Tournament } from '../../../../types';
import { fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import DoneCallback = jest.DoneCallback;

describe('TournamentDetailComponent', () => {
  let component: TournamentDetailComponent;
  let tournamentService: TournamentsService;

  let tournament: Tournament;

  beforeEach(() => {
    tournament = { name: 'YSG 2019', dateDescription: '2019' };

    tournamentService = <any>{ getSelectedTournament: jest.fn() };
    tournamentService.getSelectedTournament = () => of(tournament);

    component = new TournamentDetailComponent(tournamentService);
  });

  describe('ngOnInit', () => {
    it('loads the selected tournament', fakeAsync((done: DoneCallback) => {
      component.tournament$.subscribe((t) => {
        expect(t).toBe(tournament);
        done();
      });

      component.ngOnInit();
      tick();

      expect(component).toBeTruthy();
    }));
  });
});
