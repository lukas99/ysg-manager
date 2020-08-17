import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tournament, TournamentList } from '../../types';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CrudService } from '../../shared/crud/crud-list/crud-list.component';

@Injectable({
  providedIn: 'root'
})
export class TournamentsService implements CrudService {
  private tournamentsUrl: string;

  constructor(private http: HttpClient) {
    this.tournamentsUrl = environment.apiUrl + '/api/tournaments';
  }

  getTournaments(): Observable<Tournament[]> {
    return this.http
      .get<TournamentList>(this.tournamentsUrl)
      .pipe(map((list) => list._embedded.tournamentModelList));
  }

  createTournament(tournament: Tournament): Observable<Tournament> {
    return this.http
      .post(this.tournamentsUrl, tournament)
      .pipe(map((createdTournamenent) => <Tournament>createdTournamenent));
  }

  updateTournament(tournament: Tournament): Observable<Tournament> {
    const selfLink = tournament._links.self;
    return this.http
      .put(selfLink.href, tournament)
      .pipe(map((savedTournament) => <Tournament>savedTournament));
  }

  deleteTournament(tournament: Tournament): Observable<Tournament> {
    const selfLink = tournament._links.self;
    return this.http
      .delete(selfLink.href)
      .pipe(map((deletedTournament) => <Tournament>deletedTournament));
  }

  getItems(): Observable<any[]> {
    return this.getTournaments();
  }

  deleteItem(item: any): Observable<any> {
    return this.deleteTournament(item);
  }
}
