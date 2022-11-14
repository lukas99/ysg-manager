import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Link, Team, TeamList, Tournament } from '../../types';
import { catchError, map } from 'rxjs/operators';
import { TournamentsService } from './tournaments.service';
import { CrudStateService } from './crud-state.service';
import { CrudService } from '../../shared/crud/crud-list/crud-list.component';
import { CacheService } from './cache.service';

const STORAGE_KEY = 'ysg-teams';

@Injectable({
  providedIn: 'root'
})
export class TeamsService extends CrudStateService implements CrudService {
  private applicationTournament!: Tournament;

  constructor(
    private http: HttpClient,
    private tournamentService: TournamentsService,
    private cacheService: CacheService<Team>
  ) {
    super();
    this.tournamentService
      .getApplicationTournament()
      .subscribe((tournament) => (this.applicationTournament = tournament));
  }

  getTeam(teamLink: Link): Observable<Team> {
    return this.http.get<Team>(teamLink.href);
  }

  getTeams(): Observable<Team[]> {
    return this.http
      .get<TeamList>(this.applicationTournament._links.teams.href)
      .pipe(
        map((list) => {
          if (list && list._embedded && list._embedded.teamModelList) {
            this.cacheService.replaceCache(
              list._embedded.teamModelList,
              STORAGE_KEY
            );
            return list._embedded.teamModelList;
          } else {
            return [];
          }
        }),
        catchError(() => of(this.cacheService.getCache(STORAGE_KEY)))
      );
  }

  createTeam(team: Team): Observable<Team> {
    return this.http.post<Team>(
      this.applicationTournament._links.teams.href,
      team
    );
  }

  updateTeam(team: Team): Observable<Team> {
    const selfLink = team._links.self;
    return this.http.put<Team>(selfLink.href, team);
  }

  deleteTeam(team: Team): Observable<Team> {
    const selfLink = team._links.self;
    return this.http.delete<Team>(selfLink.href);
  }

  getTeamTitle(team: Team): string {
    return team.name;
  }

  getItems(): Observable<any[]> {
    return this.getTeams();
  }

  createItem(item: any): Observable<any> {
    return this.createTeam(item);
  }

  updateItem(item: any): Observable<any> {
    return this.updateTeam(item);
  }

  deleteItem(item: any): Observable<any> {
    return this.deleteTeam(item);
  }

  getItemTitle(item: any): string {
    return this.getTeamTitle(item);
  }
}
