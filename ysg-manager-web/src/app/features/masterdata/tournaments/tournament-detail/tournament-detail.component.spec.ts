import { TournamentDetailComponent } from './tournament-detail.component';
import { TournamentsService } from '../../../../core/services/tournaments.service';
import { Tournament } from '../../../../types';
import { fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { CrudListService } from '../../../../core/services/crud-list.service';
import DoneCallback = jest.DoneCallback;

describe('TournamentDetailComponent', () => {
  let component: TournamentDetailComponent;
  let tournamentService: TournamentsService;
  let crudListService: CrudListService;
  let router: Router;
  let formBuilder: FormBuilder;

  let existingTournament: Tournament;

  beforeEach(() => {
    existingTournament = {
      name: 'YSG 2019',
      dateDescription: '2019',
      _links: { self: { href: 'tournaments/1' } }
    };

    tournamentService = <any>{};
    tournamentService.updateTournament = jest.fn((savedTournament) =>
      of(savedTournament)
    );
    tournamentService.createTournament = jest.fn((createdTournament) =>
      of(createdTournament)
    );
    crudListService = <any>{};
    crudListService.getSelectedItem = jest.fn(() => of(existingTournament));

    router = <any>{ navigateByUrl: jest.fn() };
    formBuilder = new FormBuilder();

    component = new TournamentDetailComponent(
      tournamentService,
      crudListService,
      router,
      formBuilder
    );
  });

  describe('ngOnInit', () => {
    it('loads the selected tournament', fakeAsync((done: DoneCallback) => {
      component.tournament$.subscribe((t) => {
        expect(t).toBe(existingTournament);
        done();
      });

      component.ngOnInit();
      tick();
    }));

    it('creates the empty form', () => {
      component.ngOnInit();

      let formValue: Tournament = component.form.value;
      expect(formValue.name).toBe('');
      expect(formValue.dateDescription).toBe('');
      expect(formValue._links).toBe('');
    });

    it('loads the selected tournament into the form', fakeAsync((
      done: DoneCallback
    ) => {
      component.tournament$.subscribe((t) => {
        let formValue: Tournament = component.form.value;
        expect(formValue.name).toBe(existingTournament.name);
        expect(formValue.dateDescription).toBe(
          existingTournament.dateDescription
        );
        expect(formValue._links).toBe(existingTournament._links);
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

    it('updates a tournament', fakeAsync(() => {
      component.form.markAsDirty();

      component.save();
      tick();

      expect(tournamentService.updateTournament).toHaveBeenCalledWith(
        existingTournament
      );
    }));

    it('navigates to the overview page', fakeAsync(() => {
      component.form.markAsDirty();

      component.save();
      tick();

      expect(router.navigateByUrl).toHaveBeenCalledWith(
        '/masterdata/tournaments'
      );
    }));
  });

  describe('save with tournament update', () => {
    beforeEach(fakeAsync(() => {
      // load tournament to the form
      component.ngOnInit();
      component.tournament$.subscribe();
      tick();
    }));

    it('updates a tournament', fakeAsync(() => {
      component.form.markAsDirty();

      component.save();
      tick();

      expect(tournamentService.updateTournament).toHaveBeenCalledWith(
        existingTournament
      );
    }));

    it('navigates to the overview page', fakeAsync(() => {
      component.form.markAsDirty();

      component.save();
      tick();

      expect(router.navigateByUrl).toHaveBeenCalledWith(
        '/masterdata/tournaments'
      );
    }));
  });

  describe('save with tournament creation', () => {
    beforeEach(fakeAsync(() => {
      crudListService.getSelectedItem = jest.fn(() =>
        of(<Tournament>{ name: 'new tournament' })
      );

      // load empty tournament to the form
      component.ngOnInit();
      component.tournament$.subscribe();
      tick();
    }));

    it('creates a tournament', fakeAsync(() => {
      component.form.markAsDirty();

      component.save();
      tick();

      expect(tournamentService.createTournament).toHaveBeenCalled();
    }));

    it('navigates to the overview page', fakeAsync(() => {
      component.form.markAsDirty();

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
