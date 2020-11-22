import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Team, TeamList, Tournament } from '../../types';
import { map } from 'rxjs/operators';
import { CrudService } from '../../shared/crud/crud-list/crud-list.component';
import { TournamentsService } from './tournaments.service';

@Injectable({
  providedIn: 'root'
})
export class TeamsService implements CrudService {
  private selectedTournament!: Tournament;

  constructor(
    private http: HttpClient,
    private tournamentService: TournamentsService
  ) {
    this.tournamentService
      .getSelectedTournament()
      .subscribe((tournament) => (this.selectedTournament = tournament));
  }

  getTeams(): Observable<Team[]> {
    return this.http
      .get<TeamList>(this.selectedTournament._links.teams.href)
      .pipe(
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
    return this.http.post<Team>(
      this.selectedTournament._links.teams.href,
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
