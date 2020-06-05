import { TournamentListComponent } from './tournament-list.component';
import { TournamentsService } from '../../../../core/services/tournaments.service';
import { Tournament } from '../../../../types';
import { of } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TournamentsModuleService } from '../tournaments-module.service';
import DoneCallback = jest.DoneCallback;

describe('TournamentListComponent', () => {
  let tournaments: Tournament[];

  let component: TournamentListComponent;

  let tournamentsService: TournamentsService;
  let tournamentsModuleService: TournamentsModuleService;
  let router: Router;

  beforeEach(() => {
    tournaments = [
      {
        name: 'YSG 2019',
        dateDescription: '2019',
        _links: { self: { href: '' } }
      },
      {
        name: 'YSG 2020',
        dateDescription: '2020',
        _links: { self: { href: '' } }
      }
    ];

    tournamentsService = <any>{
      getTournaments: jest.fn()
    };
    tournamentsModuleService = <any>{
      setSelectedTournament: jest.fn()
    };
    router = <any>{ navigateByUrl: jest.fn() };
    component = new TournamentListComponent(
      tournamentsService,
      tournamentsModuleService,
      router
    );
  });

  describe('ngOnInit', () => {
    it('loads the tournaments', fakeAsync((done: DoneCallback) => {
      tournamentsService.getTournaments = () => of(tournaments);

      component.tournaments.subscribe((t) => {
        expect(t).toBe(tournaments);
        done();
      });
      component.ngOnInit();
      tick();
    }));
  });

  it('handles the edit event', () => {
    const tournament = tournaments[0];

    component.edit(tournament);

    expect(tournamentsModuleService.setSelectedTournament).toHaveBeenCalledWith(
      tournament
    );
    expect(router.navigateByUrl).toHaveBeenCalledWith(
      '/masterdata/tournaments/detail'
    );
  });
});
