import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Tournament } from '../../../types';

@Injectable()
export class TournamentsModuleService {
  private selectedTournament$ = new BehaviorSubject<Tournament>(<Tournament>{});

  constructor() {}

  setSelectedTournament(tournament: Tournament) {
    this.selectedTournament$.next(tournament);
  }

  setEmptyTournament() {
    this.selectedTournament$.next(<Tournament>{});
  }

  getSelectedTournament(): Observable<Tournament> {
    return this.selectedTournament$;
  }
}
