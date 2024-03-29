import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Tournament, TournamentList } from '../../types';
import { map, filter } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CrudStateService } from './crud-state.service';
import { CrudService } from '../../shared/crud/crud-list/crud-list.component';

@Injectable({
  providedIn: 'root'
})
export class TournamentsService
  extends CrudStateService
  implements CrudService
{
  /**
   * Base URL of the application. All other requests are done by following the tournament links.
   */
  private tournamentsUrl: string;

  /**
   * The tournament selected by the user to be used all over the application.
   */
  private applicationTournament$ = new BehaviorSubject<Tournament>(
    {} as Tournament
  );

  constructor(private http: HttpClient) {
    super();
    this.tournamentsUrl = environment.apiUrl + '/api/tournaments';
  }

  /**
   * @param applicationTournament The tournament selected by the user to be used all over the application.
   */
  setApplicationTournament(applicationTournament: Tournament) {
    this.applicationTournament$.next(applicationTournament);
  }

  /**
   * @return The tournament selected by the user to be used all over the application.
   */
  getApplicationTournament(): Observable<Tournament> {
    if (!this.applicationTournament$.value._links) {
      this.getTournaments()
        .pipe(
          filter((tournaments) => tournaments.length > 0),
          map((tournaments) => {
            let activeTournament = tournaments.find(
              (tournament) => tournament.active
            );
            return activeTournament ? activeTournament : tournaments[0];
          })
        )
        .subscribe((tournament) => this.setApplicationTournament(tournament));
    }
    return this.applicationTournament$.pipe(
      // filter initial empty value
      filter((applicationTournament) => !!applicationTournament._links)
    );
  }

  getTournaments(): Observable<Tournament[]> {
    return this.http.get<TournamentList>(this.tournamentsUrl).pipe(
      map((list) => {
        if (list && list._embedded && list._embedded.tournamentModelList) {
          return list._embedded.tournamentModelList;
        } else {
          return [];
        }
      })
    );
  }

  createTournament(tournament: Tournament): Observable<Tournament> {
    return this.http.post<Tournament>(this.tournamentsUrl, tournament);
  }

  updateTournament(tournament: Tournament): Observable<Tournament> {
    const selfLink = tournament._links.self;
    return this.http.put<Tournament>(selfLink.href, tournament);
  }

  deleteTournament(tournament: Tournament): Observable<Tournament> {
    const selfLink = tournament._links.self;
    return this.http.delete<Tournament>(selfLink.href);
  }

  getTournamentTitle(tournament: Tournament): string {
    return tournament.name;
  }

  getItems(): Observable<any[]> {
    return this.getTournaments();
  }

  createItem(item: any): Observable<any> {
    return this.createTournament(item);
  }

  updateItem(item: any): Observable<any> {
    return this.updateTournament(item);
  }

  deleteItem(item: any): Observable<any> {
    return this.deleteTournament(item);
  }

  getItemTitle(item: any): string {
    return this.getTournamentTitle(item);
  }
}
