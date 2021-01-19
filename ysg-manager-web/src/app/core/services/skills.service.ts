import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Skill, SkillList, Tournament } from '../../types';
import { map } from 'rxjs/operators';
import { CrudService } from '../../shared/crud/crud-list/crud-list.component';
import { TournamentsService } from './tournaments.service';
import { CrudStateService } from './crud-state.service';

@Injectable({
  providedIn: 'root'
})
export class SkillsService extends CrudStateService implements CrudService {
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

  getSkills(): Observable<Skill[]> {
    return this.http
      .get<SkillList>(this.applicationTournament._links.skills.href)
      .pipe(
        map((list) => {
          if (list && list._embedded && list._embedded.skillModelList) {
            return list._embedded.skillModelList;
          } else {
            return [];
          }
        })
      );
  }

  createSkill(skill: Skill): Observable<Skill> {
    return this.http.post<Skill>(
      this.applicationTournament._links.skills.href,
      skill
    );
  }

  updateSkill(skill: Skill): Observable<Skill> {
    const selfLink = skill._links.self;
    return this.http.put<Skill>(selfLink.href, skill);
  }

  deleteSkill(skill: Skill): Observable<Skill> {
    const selfLink = skill._links.self;
    return this.http.delete<Skill>(selfLink.href);
  }

  getSkillTitle(skill: Skill): string {
    return skill.name;
  }

  getItems(): Observable<any[]> {
    return this.getSkills();
  }

  createItem(item: any): Observable<any> {
    return this.createSkill(item);
  }

  updateItem(item: any): Observable<any> {
    return this.updateSkill(item);
  }

  deleteItem(item: any): Observable<any> {
    return this.deleteSkill(item);
  }

  getItemTitle(item: any): string {
    return this.getSkillTitle(item);
  }
}
