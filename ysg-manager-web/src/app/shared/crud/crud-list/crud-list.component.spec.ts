import { CrudListComponent } from './crud-list.component';
import { Tournament } from '../../../types';
import { TournamentsService } from '../../../core/services/tournaments.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { skip } from 'rxjs/operators';
import { CrudListService } from '../../../core/services/crud-list.service';
import DoneCallback = jest.DoneCallback;

describe('CrudListComponent', () => {
  let tournament1: Tournament;
  let tournament2: Tournament;
  let tournaments: Tournament[];

  let component: CrudListComponent;

  let tournamentsService: TournamentsService;
  let crudListService: CrudListService;
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
      getItems: jest
        .fn()
        .mockImplementationOnce(() => of([tournament1, tournament2]))
        .mockImplementationOnce(() => of([tournament1])), // tournament2 deleted
      deleteItem: jest.fn((deletedTournament) => of(deletedTournament))
    };
    crudListService = <any>{
      setSelectedItem: jest.fn(),
      setEmptyItem: jest.fn()
    };
    router = <any>{ navigateByUrl: jest.fn() };
    component = new CrudListComponent(crudListService, router);
    component.options = {
      headers: [
        {
          key: 'name',
          title: 'Name'
        },
        {
          key: 'dateDescription',
          title: 'Date description'
        }
      ],
      crudService: tournamentsService,
      routerDetailUrl: '/masterdata/tournaments/detail'
    };
  });

  describe('ngOnInit', () => {
    it('loads the items', (done: DoneCallback) => {
      component.ngOnInit();
      component.items$.subscribe((t) => {
        expect(t).toEqual(tournaments);
        done();
      });
    });
  });

  it('handles the edit event', () => {
    component.edit(tournament1);

    expect(crudListService.setSelectedItem).toHaveBeenCalledWith(tournament1);
    expect(router.navigateByUrl).toHaveBeenCalledWith(
      '/masterdata/tournaments/detail'
    );
  });

  it('handles the create event', () => {
    component.create();

    expect(crudListService.setEmptyItem).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith(
      '/masterdata/tournaments/detail'
    );
  });

  it('handles the delete event', (done: DoneCallback) => {
    component.ngOnInit();

    component.items$
      .pipe(skip(1)) // skip call from ngOnInit
      .subscribe((t) => {
        expect(t).toEqual([tournament1]);
        expect(tournamentsService.deleteItem).toHaveBeenCalledWith(tournament2);
        expect(tournamentsService.getItems).toHaveBeenCalledTimes(2);
        done();
      });

    component.delete(tournament2);
  });
});