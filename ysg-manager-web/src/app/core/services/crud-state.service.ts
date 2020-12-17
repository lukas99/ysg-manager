import { BehaviorSubject, Observable } from 'rxjs';

/**
 * The service used by the CRUD list component. This service holds the components state.
 *
 * This service is not injectable because it needs to exist for every data type.
 */
export class CrudStateService {
  private selectedItem$ = new BehaviorSubject<any>({});

  constructor() {}

  setSelectedItem(item: any) {
    this.selectedItem$.next(item);
  }

  removeSelectedItem() {
    this.selectedItem$.next({});
  }

  getSelectedItem(): Observable<any> {
    return this.selectedItem$;
  }

  getSelectedItemValue(): any {
    return this.selectedItem$.getValue();
  }
}
