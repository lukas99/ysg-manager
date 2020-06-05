import { TournamentDetailComponent } from './tournament-detail.component';
import { TournamentsService } from '../../../../core/services/tournaments.service';
import { Tournament } from '../../../../types';
import { fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { TournamentsModuleService } from '../tournaments-module.service';
import DoneCallback = jest.DoneCallback;

describe('TournamentDetailComponent', () => {
  let component: TournamentDetailComponent;
  let tournamentService: TournamentsService;
  let tournamentsModuleService: TournamentsModuleService;
  let router: Router;
  let formBuilder: FormBuilder;

  let tournament: Tournament;

  beforeEach(() => {
    tournament = {
      name: 'YSG 2019',
      dateDescription: '2019',
      _links: { self: { href: 'tournaments/1' } }
    };

    tournamentService = <any>{};
    tournamentService.saveTournament = jest.fn((savedTournament) =>
      of(savedTournament)
    );
    tournamentsModuleService = <any>{};
    tournamentsModuleService.getSelectedTournament = jest.fn(() =>
      of(tournament)
    );

    router = <any>{ navigateByUrl: jest.fn() };
    formBuilder = new FormBuilder();

    component = new TournamentDetailComponent(
      tournamentService,
      tournamentsModuleService,
      router,
      formBuilder
    );
  });

  describe('ngOnInit', () => {
    it('loads the selected tournament', fakeAsync((done: DoneCallback) => {
      component.tournament$.subscribe((t) => {
        expect(t).toBe(tournament);
        done();
      });

      component.ngOnInit();
      tick();
    }));

    it('creates the empty form', () => {
      component.ngOnInit();

      let formValue: Tournament = component.form?.value;
      expect(formValue.name).toBe('');
      expect(formValue.dateDescription).toBe('');
      expect(formValue._links).toBe('');
    });

    it('loads the selected tournament into the form', fakeAsync((
      done: DoneCallback
    ) => {
      component.tournament$.subscribe((t) => {
        let formValue: Tournament = component.form?.value;
        expect(formValue.name).toBe(tournament.name);
        expect(formValue.dateDescription).toBe(tournament.dateDescription);
        expect(formValue._links).toBe(tournament._links);
        done();
      });

      component.ngOnInit();
      tick();
    }));
  });

  describe('save', () => {
    beforeEach(fakeAsync(() => {
      // load tournament to the form
      component.ngOnInit();
      component.tournament$.subscribe();
      tick();
    }));

    it('saves a tournament', fakeAsync(() => {
      component.save();
      tick();
      expect(tournamentService.saveTournament).toHaveBeenCalledWith(tournament);
    }));

    it('navigates to the overview page', fakeAsync(() => {
      component.save();
      tick();
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        '/masterdata/tournaments'
      );
    }));
  });

  describe('cancel', () => {
    it('navigates to the tournaments overview page', () => {
      component.cancel();
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        '/masterdata/tournaments'
      );
    });
  });
});
