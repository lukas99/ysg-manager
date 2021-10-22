import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
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
export class SkillTournamentRankingsService extends CrudStateService
  implements CrudService {
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
    return this.getSkillTournamentRankings();
  }

  createItem(item: any): Observable<any> {
    throw new Error(
      'unsupported operation: SkillTournamentRankingsService#createItem'
    );
  }

  updateItem(item: any): Observable<any> {
    throw new Error(
      'unsupported operation: SkillTournamentRankingsService#updateItem'
    );
  }

  deleteItem(item: any): Observable<any> {
    throw new Error(
      'unsupported operation: SkillTournamentRankingsService#deleteItem'
    );
  }

  getItemTitle(item: any): string {
    throw new Error(
      'unsupported operation: SkillTournamentRankingsService#getItemTitle'
    );
  }
}
