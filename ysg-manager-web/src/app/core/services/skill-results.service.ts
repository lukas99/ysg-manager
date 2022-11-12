import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { Player, Skill, SkillResult, SkillResultList, Team } from '../../types';
import { CrudStateService } from './crud-state.service';
import { SkillsService } from './skills.service';
import { CrudService } from '../../shared/crud/crud-list/crud-list.component';
import { CacheService } from './cache.service';

export const STORAGE_KEY = 'ysg-skill-results';

@Injectable({
  providedIn: 'root'
})
export class SkillResultsService
  extends CrudStateService
  implements CrudService
{
  constructor(
    private http: HttpClient,
    private skillsService: SkillsService,
    private cacheService: CacheService
  ) {
    super();
  }

  getSkillResults(skill: Skill): Observable<SkillResult[]> {
    return this.http.get<SkillResultList>(skill._links.skillresults.href).pipe(
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

  addSkillResultToCache(skillResult: SkillResult): void {
    this.cacheService.addToCache(skillResult, STORAGE_KEY);
  }

  updateSkillResultInCache(skillResult: SkillResult): void {
    this.cacheService.updateInCache(skillResult, STORAGE_KEY);
  }

  removeSkillResultFromCache(skillResult: SkillResult): void {
    this.cacheService.removeFromCache(skillResult, STORAGE_KEY);
  }

  getCachedSkillResults(skill: Skill, team: Team): SkillResult[] {
    return this.cacheService
      .getCache(STORAGE_KEY)
      .filter(
        (skillResult) =>
          skillResult.player.team._links.self.href === team._links.self.href &&
          skillResult._links.skill.href === skill._links.self.href
      );
  }

  getCachedSkillResult(
    skill: Skill,
    team: Team,
    player: Player
  ): SkillResult | null {
    let skillResults = this.getCachedSkillResults(skill, team).filter(
      (skillResult) => skillResult.player.shirtNumber === player.shirtNumber
    );
    return skillResults.length > 0 ? skillResults[0] : null;
  }

  pushCachedSkillResultsToServer(): void {
    this.skillsService
      .getSkills()
      .pipe(take(1))
      .subscribe((skills) => {
        let observables: Observable<SkillResult>[] = [];
        this.cacheService.getCache(STORAGE_KEY).forEach((skillResult) => {
          if (this.shouldUpdate(skillResult)) {
            observables.push(
              this.updateSkillResult(skillResult).pipe(
                catchError((error) => of(skillResult))
              )
            );
          } else {
            const skill = skills.find(
              (s) => s._links.self.href === skillResult._links.skill.href
            ) as Skill;
            observables.push(
              this.createSkillResult(skillResult, skill).pipe(
                catchError((error) => of(skillResult))
              )
            );
          }
        });
        forkJoin(observables).subscribe((value) =>
          // Hint: items get fresh cacheIDs.
          // Only set new cacheID when no cacheID is available doesn't help because we have here
          // the skill result values from the server which does not have the cacheID persisted.
          this.cacheService.replaceCache(value, STORAGE_KEY)
        );
      });
  }

  private shouldUpdate(item: any) {
    return item._links && item._links.self;
  }
}
