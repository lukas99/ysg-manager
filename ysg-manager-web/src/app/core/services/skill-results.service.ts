import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Skill, SkillResult, SkillResultList, Team } from '../../types';
import { CrudStateService } from './crud-state.service';
import { SkillsService } from './skills.service';
import { CrudService } from '../../shared/crud/crud-list/crud-list.component';

export const STORAGE_KEY = 'ysg-skill-results';

@Injectable({
  providedIn: 'root'
})
export class SkillResultsService
  extends CrudStateService
  implements CrudService
{
  constructor(private http: HttpClient, private skillsService: SkillsService) {
    super();
  }

  getSkillResults(skill: Skill): Observable<SkillResult[]> {
    const url = skill._links.skillresults.href;
    return this.loadSkillResults(url);
  }

  getSkillResultsBySkillAndTeam(
    skill: Skill,
    team: Team
  ): Observable<SkillResult[]> {
    const url = decodeURIComponent(
      skill._links.skillResultsByTeam.href
    ).replace(':teamId', team.id.toString());
    return this.loadSkillResults(url);
  }

  getSkillResultsBySkillAndTeamAndPlayerShirtNumber(
    skill: Skill,
    team: Team,
    playerShirtNumber: number
  ): Observable<SkillResult[]> {
    const url = decodeURIComponent(
      skill._links.skillResultsByTeamAndPlayerShirtNumber.href
    )
      .replace(':teamId', team.id.toString())
      .replace(':playerShirtNumber', playerShirtNumber.toString());
    return this.loadSkillResults(url);
  }

  private loadSkillResults(url: string) {
    return this.http.get<SkillResultList>(url).pipe(
      map((list) => {
        if (list && list._embedded && list._embedded.skillResultModelList) {
          return list._embedded.skillResultModelList;
        } else {
          return [];
        }
      })
    );
  }

  createSkillResult(
    skillResult: SkillResult,
    skill: Skill
  ): Observable<SkillResult> {
    return this.http.post<SkillResult>(
      skill._links.skillresults.href,
      skillResult
    );
  }

  updateSkillResult(skillResult: SkillResult): Observable<SkillResult> {
    const selfLink = skillResult._links.self;
    return this.http.put<SkillResult>(selfLink.href, skillResult);
  }

  deleteSkillResult(skillResult: SkillResult): Observable<SkillResult> {
    const selfLink = skillResult._links.self;
    return this.http.delete<SkillResult>(selfLink.href);
  }

  getSkillResultTitle(skillResult: SkillResult): string {
    const selectedSkill = <Skill>this.skillsService.getSelectedItemValue();
    if (skillResult.player) {
      return `${skillResult.player.firstName} ${skillResult.player.lastName} (${selectedSkill.name})`;
    } else {
      return `${selectedSkill.name}`;
    }
  }

  getItems(): Observable<any[]> {
    const selectedSkill = <Skill>this.skillsService.getSelectedItemValue();
    return this.getSkillResults(selectedSkill);
  }

  createItem(item: any): Observable<any> {
    const selectedSkill = <Skill>this.skillsService.getSelectedItemValue();
    return this.createSkillResult(item, selectedSkill);
  }

  updateItem(item: any): Observable<any> {
    return this.updateSkillResult(item);
  }

  deleteItem(item: any): Observable<any> {
    return this.deleteSkillResult(item);
  }

  getItemTitle(item: any): string {
    return this.getSkillResultTitle(item);
  }
}
