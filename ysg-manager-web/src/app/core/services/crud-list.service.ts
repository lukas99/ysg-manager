import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * The service used by the CRUD list component. This service holds the components state.
 */
@Injectable({
  providedIn: 'root'
})
export class CrudListService {
  private selectedItem$ = new BehaviorSubject<any>({});

  constructor() {}

  setSelectedItem(item: any) {
    this.selectedItem$.next(item);
  }

  setEmptyItem() {
    this.selectedItem$.next({});
  }

  getSelectedItem(): Observable<any> {
    return this.selectedItem$;
  }
}
