import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tournament, TournamentList } from '../../types';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TournamentsService {
  private tournamentsUrl: string;

  constructor(private http: HttpClient) {
    this.tournamentsUrl = environment.apiUrl + '/api/tournaments';
  }

  getTournaments(): Observable<Tournament[]> {
    return this.http
      .get<TournamentList>(this.tournamentsUrl)
      .pipe(map((list) => list._embedded.tournamentModelList));
  }

  saveTournament(tournament: Tournament): Observable<Tournament> {
    const selfLink = tournament._links.self;
    return this.http
      .put(selfLink.href, tournament)
      .pipe(map((tournament) => <Tournament>tournament));
  }
}
