import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Player, Skill, SkillRating, SkillRatingList, Team } from '../../types';
import { CrudStateService } from './crud-state.service';
import { SkillsService } from './skills.service';
import { CrudService } from '../../shared/crud/crud-list/crud-list.component';
import {
  SkillScoresPushResult,
  SkillScoresService
} from './skill-scores.service';

export const STORAGE_KEY = 'ysg-skill-ratings';

@Injectable({
  providedIn: 'root'
})
export class SkillRatingsService
  extends CrudStateService
  implements CrudService
{
  constructor(
    private http: HttpClient,
    private skillsService: SkillsService,
    private skillScoresService: SkillScoresService<SkillRating>
  ) {
    super();
  }

  getSkillRatings(skill: Skill): Observable<SkillRating[]> {
    return this.http.get<SkillRatingList>(skill._links.skillratings.href).pipe(
      map((list) => {
        if (list && list._embedded && list._embedded.skillRatingModelList) {
          return list._embedded.skillRatingModelList;
        } else {
          return [];
        }
      })
    );
  }

  createSkillRating(
    skillRating: SkillRating,
    skill: Skill
  ): Observable<SkillRating> {
    return this.http.post<SkillRating>(
      skill._links.skillratings.href,
      skillRating
    );
  }

  updateSkillRating(skillRating: SkillRating): Observable<SkillRating> {
    const selfLink = skillRating._links.self;
    return this.http.put<SkillRating>(selfLink.href, skillRating);
  }

  deleteSkillRating(skillRating: SkillRating): Observable<SkillRating> {
    const selfLink = skillRating._links.self;
    return this.http.delete<SkillRating>(selfLink.href);
  }

  getSkillRatingTitle(skillRating: SkillRating): string {
    const selectedSkill = <Skill>this.skillsService.getSelectedItemValue();
    if (skillRating.player) {
      return `${skillRating.player.firstName} ${skillRating.player.lastName} (${selectedSkill.name})`;
    } else {
      return `${selectedSkill.name}`;
    }
  }

  getItems(): Observable<any[]> {
    const selectedSkill = <Skill>this.skillsService.getSelectedItemValue();
    return this.getSkillRatings(selectedSkill);
  }

  createItem(item: any): Observable<any> {
    const selectedSkill = <Skill>this.skillsService.getSelectedItemValue();
    return this.createSkillRating(item, selectedSkill);
  }

  updateItem(item: any): Observable<any> {
    return this.updateSkillRating(item);
  }

  deleteItem(item: any): Observable<any> {
    return this.deleteSkillRating(item);
  }

  getItemTitle(item: any): string {
    return this.getSkillRatingTitle(item);
  }

  addSkillRatingToCache(skillRating: SkillRating): void {
    this.skillScoresService.addToCache(skillRating, STORAGE_KEY);
  }

  updateSkillRatingInCache(skillRating: SkillRating): void {
    this.skillScoresService.updateInCache(skillRating, STORAGE_KEY);
  }

  removeSkillRatingFromCache(skillRating: SkillRating): void {
    this.skillScoresService.removeFromCache(skillRating, STORAGE_KEY);
  }

  getCachedSkillRatings(skill: Skill, team: Team): SkillRating[] {
    return this.skillScoresService.getCachedSkillScores(
      skill,
      team,
      STORAGE_KEY
    );
  }

  getCachedSkillRating(
    skill: Skill,
    team: Team,
    player: Player
  ): SkillRating | null {
    return this.skillScoresService.getCachedSkillScore(
      skill,
      team,
      player,
      STORAGE_KEY
    );
  }

  pushCachedSkillRatingsToServer(): Observable<SkillScoresPushResult> {
    return this.skillScoresService.pushCachedSkillScoresToServer(
      this.skillsService.getSkills(),
      STORAGE_KEY,
      (rating: SkillRating) => this.updateSkillRating(rating),
      (rating: SkillRating, skill: Skill) =>
        this.createSkillRating(rating, skill)
    );
  }
}
