import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Skill, SkillList, Tournament } from '../../types';
import { map } from 'rxjs/operators';
import { TournamentsService } from './tournaments.service';
import { CrudStateService } from './crud-state.service';
import { CrudService } from '../../shared/crud/crud-list/crud-list.component';

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
            const skills = this.sortBySkillNumber(
              list._embedded.skillModelList
            );
            return skills;
          } else {
            return [];
          }
        })
      );
  }

  private sortBySkillNumber(skills: Skill[]): Skill[] {
    return skills.sort((s1, s2) => s1.number - s2.number);
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

  calculateSkillRankings(): Observable<void> {
    const rankingCalculationLink =
      this.applicationTournament._links.calculateskillrankings;
    return this.http.post<void>(rankingCalculationLink.href, {});
  }
}
