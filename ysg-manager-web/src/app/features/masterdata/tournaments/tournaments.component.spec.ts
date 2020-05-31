import { TournamentsComponent } from './tournaments.component';
import { TournamentsService } from '../../../core/services/tournaments.service';
import { Tournament } from '../../../types';
import { of } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';
import DoneCallback = jest.DoneCallback;

describe('TournamentsComponent', () => {
  let tournamentService: TournamentsService;
  let component: TournamentsComponent;

  beforeEach(() => {
    tournamentService = <any>{ getTournaments: jest.fn() };
    component = new TournamentsComponent(tournamentService);
  });

  describe('ngOnInit', () => {
    it('loads the tournaments', fakeAsync((done: DoneCallback) => {
      const tournaments = [
        <Tournament>{ name: 'YSG 2019', dateDescription: '2019' },
        <Tournament>{ name: 'YSG 2020', dateDescription: '2020' }
      ];
      tournamentService.getTournaments = () => of(tournaments);

      component.tournaments.subscribe((t) => {
        expect(t).toBe(tournaments);
        done();
      });
      component.ngOnInit();
      tick();
    }));
  });
});
