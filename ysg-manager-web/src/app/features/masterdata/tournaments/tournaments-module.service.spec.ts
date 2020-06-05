import { fakeAsync, tick } from '@angular/core/testing';

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

  it('can select and get a tournament', fakeAsync((done: DoneCallback) => {
    service.getSelectedTournament().pipe(
      take(1),
      tap((t) => expect(t).toBe({}))
    );
    service.getSelectedTournament().pipe(
      skip(1),
      tap((t) => expect(t).toBe(tournament)),
      tap((t) => done())
    );

    service.setSelectedTournament(tournament);
    tick();
  }));
});
