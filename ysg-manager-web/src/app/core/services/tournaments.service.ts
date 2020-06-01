import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, EMPTY, Observable, Subject } from 'rxjs';
import { Tournament, TournamentList } from '../../types';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TournamentsService {
  private tournamentsUrl: string;
  private selectedTournament$ = new BehaviorSubject<Tournament>(<Tournament>{});

  constructor(private http: HttpClient) {
    this.tournamentsUrl = environment.apiUrl + '/api/tournaments';
  }

  getTournaments(): Observable<Tournament[]> {
    return this.http
      .get<TournamentList>(this.tournamentsUrl)
      .pipe(map((list) => list._embedded.tournamentModelList));
  }

  setSelectedTournament(tournament: Tournament) {
    this.selectedTournament$.next(tournament);
  }

  getSelectedTournament(): Observable<Tournament> {
    return this.selectedTournament$;
  }
}
