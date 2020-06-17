import { TournamentListComponent } from './tournament-list.component';
import { TournamentsService } from '../../../../core/services/tournaments.service';
import { Tournament } from '../../../../types';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { TournamentsModuleService } from '../tournaments-module.service';
import { skip } from 'rxjs/operators';
import DoneCallback = jest.DoneCallback;

describe('TournamentListComponent', () => {
  let tournament1: Tournament;
  let tournament2: Tournament;
  let tournaments: Tournament[];

  let component: TournamentListComponent;

  let tournamentsService: TournamentsService;
  let tournamentsModuleService: TournamentsModuleService;
  let router: Router;

  beforeEach(() => {
    tournament1 = {
      name: 'YSG 2019',
      dateDescription: '2019',
      _links: { self: { href: '' } }
    };
    tournament2 = {
      name: 'YSG 2020',
      dateDescription: '2020',
      _links: { self: { href: '' } }
    };
    tournaments = [tournament1, tournament2];

    tournamentsService = <any>{
      getTournaments: jest
        .fn()
        .mockImplementationOnce(() => of([tournament1, tournament2]))
        .mockImplementationOnce(() => of([tournament1])), // tournament2 deleted,
      deleteTournament: jest.fn((deletedTournament) => of(deletedTournament))
    };
    tournamentsModuleService = <any>{
      setSelectedTournament: jest.fn(),
      setEmptyTournament: jest.fn()
    };
    router = <any>{ navigateByUrl: jest.fn() };
    component = new TournamentListComponent(
      tournamentsService,
      tournamentsModuleService,
      router
    );
  });

  describe('ngOnInit', () => {
    it('loads the tournaments', (done: DoneCallback) => {
      component.ngOnInit();
      component.tournaments$.subscribe((t) => {
        expect(t).toEqual(tournaments);
        done();
      });
    });
  });

  it('handles the edit event', () => {
    component.edit(tournament1);

    expect(tournamentsModuleService.setSelectedTournament).toHaveBeenCalledWith(
      tournament1
    );
    expect(router.navigateByUrl).toHaveBeenCalledWith(
      '/masterdata/tournaments/detail'
    );
  });

  it('handles the create event', () => {
    component.create();

    expect(tournamentsModuleService.setEmptyTournament).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith(
      '/masterdata/tournaments/detail'
    );
  });

  it('handles the delete event', (done: DoneCallback) => {
    component.ngOnInit();

    component.tournaments$
      .pipe(skip(1)) // skip call from ngOnInit
      .subscribe((t) => {
        expect(t).toEqual([tournament1]);
        expect(tournamentsService.deleteTournament).toHaveBeenCalledWith(
          tournament2
        );
        expect(tournamentsService.getTournaments).toHaveBeenCalledTimes(2);
        done();
      });

    component.delete(tournament2);
  });
});
