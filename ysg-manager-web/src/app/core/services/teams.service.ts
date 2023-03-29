import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Team, TeamList, Tournament } from '../../types';
import { flatMap, map } from 'rxjs/operators';
import { TournamentsService } from './tournaments.service';
import { CrudStateService } from './crud-state.service';
import { CrudService } from '../../shared/crud/crud-list/crud-list.component';

@Injectable({
  providedIn: 'root'
})
export class TeamsService extends CrudStateService implements CrudService {
  private applicationTournament$: Observable<Tournament>;

  constructor(
    private http: HttpClient,
    private tournamentService: TournamentsService
  ) {
    super();
    this.applicationTournament$ =
      this.tournamentService.getApplicationTournament();
  }

  getTeam(id: number): Observable<Team> {
    return this.applicationTournament$.pipe(
      map((applicationTournament) => applicationTournament._links.team.href),
      map((templateUrl) => decodeURIComponent(templateUrl)),
      map((decodedUrl) => decodedUrl.replace(':teamId', id.toString())),
      flatMap((url) => this.http.get<Team>(url))
    );
  }

  getTeams(): Observable<Team[]> {
    return this.applicationTournament$.pipe(
      flatMap((applicationTournament) =>
        this.http.get<TeamList>(applicationTournament._links.teams.href)
      ),
      map((list) => {
        if (list && list._embedded && list._embedded.teamModelList) {
          return list._embedded.teamModelList;
        } else {
          return [];
        }
      })
    );
  }

  createTeam(team: Team): Observable<Team> {
    return this.applicationTournament$.pipe(
      flatMap((applicationTournament) =>
        this.http.post<Team>(applicationTournament._links.teams.href, team)
      )
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
