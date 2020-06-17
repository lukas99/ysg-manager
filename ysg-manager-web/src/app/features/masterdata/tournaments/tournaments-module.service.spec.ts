import { TournamentsModuleService } from './tournaments-module.service';
import { Tournament } from '../../../types';
import { skip, take, tap } from 'rxjs/operators';
import DoneCallback = jest.DoneCallback;

describe('TournamentsModuleService', () => {
  let tournament: Tournament;
  let service: TournamentsModuleService;

  beforeEach(() => {
    tournament = <Tournament>{ name: 'YSG 2020' };
    service = new TournamentsModuleService();
  });

  it('can select and get a tournament', (done: DoneCallback) => {
    service
      .getSelectedTournament()
      .pipe(
        take(1), // initial value
        tap((t) => expect(t).toEqual({}))
      )
      .subscribe();

    service
      .getSelectedTournament()
      .pipe(
        skip(1), // set value
        tap((t) => expect(t).toEqual(tournament)),
        tap((t) => done())
      )
      .subscribe();

    service.setSelectedTournament(tournament);
  });

  it('can select and get an empty tournament', (done: DoneCallback) => {
    service
      .getSelectedTournament()
      .pipe(
        take(1), // initial value
        tap((t) => expect(t).toEqual({}))
      )
      .subscribe();

    service
      .getSelectedTournament()
      .pipe(
        skip(1), // set value
        tap((t) => expect(t).toEqual({})),
        tap((t) => done())
      )
      .subscribe();

    service.setEmptyTournament();
  });
});
