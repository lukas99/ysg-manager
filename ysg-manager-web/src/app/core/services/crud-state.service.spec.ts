import { Tournament } from '../../types';
import { CrudStateService } from './crud-state.service';
import { skip, take, tap } from 'rxjs/operators';
import DoneCallback = jest.DoneCallback;

describe('CrudService', () => {
  let tournament: Tournament;
  let service: CrudStateService;

  beforeEach(() => {
    tournament = <Tournament>{ name: 'YSG 2020' };
    service = new CrudStateService();
  });

  it('can select and get an item', (done: DoneCallback) => {
    service
      .getSelectedItem()
      .pipe(
        take(1), // initial value
        tap((t) => expect(t).toEqual({}))
      )
      .subscribe();

    service
      .getSelectedItem()
      .pipe(
        skip(1), // set value
        tap((t) => expect(t).toEqual(tournament)),
        tap((t) => done())
      )
      .subscribe();

    service.setSelectedItem(tournament);
  });

  it('can select and get an empty item', (done: DoneCallback) => {
    service
      .getSelectedItem()
      .pipe(
        take(1), // initial value
        tap((t) => expect(t).toEqual({}))
      )
      .subscribe();

    service
      .getSelectedItem()
      .pipe(
        skip(1), // set value
        tap((t) => expect(t).toEqual({})),
        tap((t) => done())
      )
      .subscribe();

    service.setEmptyItem();
  });
});
