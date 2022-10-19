import { fakeAsync, tick } from '@angular/core/testing';

import { TournamentPickerComponent } from './tournament-picker.component';
import { TournamentsService } from '../services/tournaments.service';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { Tournament } from '../../types';
import { of } from 'rxjs';

describe('TournamentPickerComponent', () => {
  let component: TournamentPickerComponent;
  let tournamentService: TournamentsService;
  let router: Router;

  let tournament1: Tournament;
  let tournament2: Tournament;
  let tournaments: Tournament[];

  beforeEach(() => {
    tournament1 = <Tournament>{ name: 'YSG 2019', _links: {} };
    tournament2 = <Tournament>{ name: 'YSG 2020', _links: {} };
    tournaments = [tournament1, tournament2];

    tournamentService = <any>{
      getTournaments: jest.fn(() => of(tournaments)),
      getApplicationTournament: jest.fn(() => of(tournament2)),
      setApplicationTournament: jest.fn()
    };
    router = <Router>{
      events: of(<RouterEvent>new NavigationEnd(1, '/skills', ''))
    };
    component = new TournamentPickerComponent(tournamentService, router);
  });

  describe('ngOnInit', () => {
    it('loads all tournaments', fakeAsync(() => {
      component.ngOnInit();
      tick();
      expect(component.tournaments).toBe(tournaments);
    }));

    it('loads the selected tournament name', fakeAsync(() => {
      component.ngOnInit();
      tick();
      expect(component.selectedTournamentName).toBe('YSG 2020');
    }));
  });

  describe('is editable', () => {
    it('is editable on route tournaments', fakeAsync(() => {
      router = <Router>{
        events: of(<RouterEvent>new NavigationEnd(1, '/tournaments', ''))
      };
      component = new TournamentPickerComponent(tournamentService, router);

      component.ngOnInit();
      tick();

      expect(component.isEditable).toBeTruthy();
    }));

    it('is not editable', fakeAsync(() => {
      router = <Router>{
        events: of(<RouterEvent>new NavigationEnd(1, '/skills', ''))
      };
      component = new TournamentPickerComponent(tournamentService, router);

      component.ngOnInit();
      tick();

      expect(component.isEditable).toBeFalsy();
    }));
  });

  it('can use a selected tournament', () => {
    component.useTournament(tournament1);

    expect(tournamentService.setApplicationTournament).toHaveBeenCalledWith(
      tournament1
    );
    expect((component.selectedTournamentName = 'YSG 2019'));
  });
});
