import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CrudService } from '../../shared/crud/crud-list/crud-list.component';
import { Player, PlayerList, Team } from '../../types';
import { CrudStateService } from './crud-state.service';
import { TeamsService } from './teams.service';

@Injectable({
  providedIn: 'root'
})
export class PlayersService extends CrudStateService implements CrudService {
  constructor(private http: HttpClient, private teamsService: TeamsService) {
    super();
  }

  getPlayers(team: Team): Observable<Player[]> {
    return this.http.get<PlayerList>(team._links.players.href).pipe(
      map((list) => {
        if (list && list._embedded && list._embedded.playerModelList) {
          return list._embedded.playerModelList;
        } else {
          return [];
        }
      })
    );
  }

  createPlayer(player: Player, team: Team): Observable<Player> {
    return this.http.post<Player>(team._links.players.href, player);
  }

  updatePlayer(player: Player): Observable<Player> {
    const selfLink = player._links.self;
    return this.http.put<Player>(selfLink.href, player);
  }

  deletePlayer(player: Player): Observable<Player> {
    const selfLink = player._links.self;
    return this.http.delete<Player>(selfLink.href);
  }

  getPlayerTitle(player: Player): string {
    return player.firstName + ' ' + player.lastName;
  }

  getItems(): Observable<any[]> {
    const selectedTeam = <Team>this.teamsService.getSelectedItemValue();
    return this.getPlayers(selectedTeam);
  }

  createItem(item: any): Observable<any> {
    const selectedTeam = <Team>this.teamsService.getSelectedItemValue();
    return this.createPlayer(item, selectedTeam);
  }

  updateItem(item: any): Observable<any> {
    return this.updatePlayer(item);
  }

  deleteItem(item: any): Observable<any> {
    return this.deletePlayer(item);
  }

  getItemTitle(item: any): string {
    return this.getPlayerTitle(item);
  }
}
