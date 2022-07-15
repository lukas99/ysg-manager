import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  SkillRanking,
  SkillRankingList,
  SkillTournamentRanking,
  SkillTournamentRankingList,
  Tournament
} from '../../types';
import { CrudStateService } from './crud-state.service';
import { CrudService } from '../../shared/crud/crud-list/crud-list.component';
import { TournamentsService } from './tournaments.service';

@Injectable({
  providedIn: 'root'
})
export class SkillRankingsService
  extends CrudStateService
  implements CrudService
{
  private applicationTournament!: Tournament;

  constructor(
    private http: HttpClient,
    private tournamentService: TournamentsService
  ) {
    super();
    this.tournamentService
      .getApplicationTournament()
      .subscribe((tournament) => (this.applicationTournament = tournament));
  }

  getSkillRankings(): Observable<SkillRanking[]> {
    return this.http
      .get<SkillRankingList>(
        this.applicationTournament._links.skillrankings.href
      )
      .pipe(
        map((list) => {
          if (list && list._embedded && list._embedded.skillRankingModelList) {
            return list._embedded.skillRankingModelList;
          } else {
            return [];
          }
        })
      );
  }

  getSkillTournamentRankings(): Observable<SkillTournamentRanking[]> {
    return this.http
      .get<SkillTournamentRankingList>(
        this.applicationTournament._links.skilltournamentrankings.href
      )
      .pipe(
        map((list) => {
          if (
            list &&
            list._embedded &&
            list._embedded.skillTournamentRankingModelList
          ) {
            return list._embedded.skillTournamentRankingModelList;
          } else {
            return [];
          }
        })
      );
  }

  getItems(): Observable<any[]> {
    return this.getSkillRankings();
  }

  createItem(item: any): Observable<any> {
    throw new Error('unsupported operation: SkillRankingsService#createItem');
  }

  updateItem(item: any): Observable<any> {
    throw new Error('unsupported operation: SkillRankingsService#updateItem');
  }

  deleteItem(item: any): Observable<any> {
    throw new Error('unsupported operation: SkillRankingsService#deleteItem');
  }

  getItemTitle(item: any): string {
    throw new Error('unsupported operation: SkillRankingsService#getItemTitle');
  }
}
