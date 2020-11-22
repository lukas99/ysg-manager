import { fakeAsync, tick } from '@angular/core/testing';

import { CrudDetailComponent } from './crud-detail.component';
import { TournamentsService } from '../../../core/services/tournaments.service';
import { CrudListService } from '../../../core/services/crud-list.service';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Tournament } from '../../../types';
import { of } from 'rxjs';

describe('CrudDetailComponent', () => {
  let component: CrudDetailComponent;
  let tournamentService: TournamentsService;
  let crudListService: CrudListService;
  let router: Router;
  let formBuilder: FormBuilder;

  let existingTournament: Tournament;

  beforeEach(() => {
    existingTournament = {
      name: 'YSG 2019',
      dateDescription: '2019',
      _links: {
        self: { href: 'tournaments/1' },
        teams: { href: 'tournaments/1/teams' }
      }
    };

    tournamentService = <any>{};
    tournamentService.updateItem = jest.fn((savedTournament) =>
      of(savedTournament)
    );
    tournamentService.createItem = jest.fn((createdTournament) =>
      of(createdTournament)
    );
    tournamentService.getItemTitle = jest.fn(() => 'item title');
    crudListService = <any>{};
    crudListService.getSelectedItem = jest.fn(() => of(existingTournament));

    router = <any>{ navigateByUrl: jest.fn() };
    formBuilder = new FormBuilder();

    component = new CrudDetailComponent(crudListService, router);

    component.options = {
      form: new FormGroup({
        name: new FormControl('', Validators.required),
        dateDescription: new FormControl(''),
        _links: new FormControl('')
      }),
      crudService: tournamentService,
      routerListUrl: '/masterdata/tournaments'
    };
  });

  describe('ngOnInit', () => {
    it('loads the selected item', fakeAsync(() => {
      component.ngAfterContentInit();
      component.ngOnInit();
      let expectedItem = {} as Tournament;
      component.item$.subscribe((t) => (expectedItem = t));
      tick();

      expect(expectedItem).toBe(existingTournament);
    }));

    it('creates the empty form', () => {
      component.ngAfterContentInit();
      component.ngOnInit();

      expect(component.form).not.toBeNull();
    });

    it('loads the selected item into the form', fakeAsync(() => {
      component.ngAfterContentInit();
      component.ngOnInit();
      component.item$.subscribe();
      tick();

      let formValue: Tournament = component.form.value;
      expect(formValue.name).toBe(existingTournament.name);
      expect(formValue.dateDescription).toBe(
        existingTournament.dateDescription
      );
      expect(formValue._links).toBe(existingTournament._links);
    }));
  });

  describe('getTitle', () => {
    it('loads and returns the title in case it is not yet loaded', () => {
      const title = component.getTitle(existingTournament);

      expect(title).toBe('item title');
      expect(tournamentService.getItemTitle).toHaveBeenCalledWith(
        existingTournament
      );
    });

    it('returns the title in case it is already loaded', () => {
      component['title'] = 'existing title';
      const title = component.getTitle(existingTournament);

      expect(title).toBe('existing title');
      expect(tournamentService.getItemTitle).not.toHaveBeenCalled();
    });
  });

  describe('save', () => {
    beforeEach(fakeAsync(() => {
      // load tournament to the form
      component.ngAfterContentInit();
      component.ngOnInit();
      component.item$.subscribe();
      tick();
    }));

    it('updates an item', fakeAsync(() => {
      component.form.markAsDirty();

      component.save();
      tick();

      expect(tournamentService.updateItem).toHaveBeenCalledWith(
        existingTournament
      );
    }));

    it('navigates to the list overview page', fakeAsync(() => {
      component.form.markAsDirty();

      component.save();
      tick();

      expect(router.navigateByUrl).toHaveBeenCalledWith(
        '/masterdata/tournaments'
      );
    }));
  });

  describe('save with item update', () => {
    beforeEach(fakeAsync(() => {
      // load tournament to the form
      component.ngAfterContentInit();
      component.ngOnInit();
      component.item$.subscribe();
      tick();
    }));

    it('updates an item', fakeAsync(() => {
      component.form.markAsDirty();

      component.save();
      tick();

      expect(tournamentService.updateItem).toHaveBeenCalledWith(
        existingTournament
      );
    }));

    it('navigates to the list overview page', fakeAsync(() => {
      component.form.markAsDirty();

      component.save();
      tick();

      expect(router.navigateByUrl).toHaveBeenCalledWith(
        '/masterdata/tournaments'
      );
    }));
  });

  describe('save with item creation', () => {
    beforeEach(fakeAsync(() => {
      crudListService.getSelectedItem = jest.fn(() =>
        of(<Tournament>{ name: 'new tournament' })
      );

      // load empty tournament to the form
      component.ngAfterContentInit();
      component.ngOnInit();
      component.item$.subscribe();
      tick();
    }));

    it('creates an item', fakeAsync(() => {
      component.form.markAsDirty();

      component.save();
      tick();

      expect(tournamentService.createItem).toHaveBeenCalled();
    }));

    it('navigates to the list overview page', fakeAsync(() => {
      component.form.markAsDirty();

      component.save();
      tick();

      expect(router.navigateByUrl).toHaveBeenCalledWith(
        '/masterdata/tournaments'
      );
    }));
  });

  describe('cancel', () => {
    it('navigates to the list overview page', () => {
      component.cancel();
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        '/masterdata/tournaments'
      );
    });
  });
});
