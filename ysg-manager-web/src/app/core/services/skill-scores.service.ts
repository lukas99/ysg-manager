import { Injectable } from '@angular/core';
import { Player, Skill, SkillScore, Team } from '../../types';
import { CacheService } from './cache.service';
import { catchError, take } from 'rxjs/operators';
import { forkJoin, Observable, of } from 'rxjs';

/**
 * Service to store items in the local storage cache.
 * Type of cached items must inherit from type CacheSupport.
 */
@Injectable({
  providedIn: 'root'
})
export class SkillScoresService<T extends SkillScore> {
  constructor(private cacheService: CacheService<T>) {}

  addToCache(skillScore: T, storageKey: string): void {
    this.cacheService.addToCache(skillScore, storageKey);
  }

  updateInCache(skillScore: T, storageKey: string): void {
    this.cacheService.updateInCache(skillScore, storageKey);
  }

  removeFromCache(skillScore: T, storageKey: string): void {
    this.cacheService.removeFromCache(skillScore, storageKey);
  }

  getCachedSkillScores(skill: Skill, team: Team, storageKey: string): T[] {
    return this.cacheService
      .getCache(storageKey)
      .filter(
        (skillScore) =>
          skillScore.player.team._links.self.href === team._links.self.href &&
          skillScore._links.skill.href === skill._links.self.href
      );
  }

  getCachedSkillScore(
    skill: Skill,
    team: Team,
    player: Player,
    storageKey: string
  ): T | null {
    let skillScores = this.getCachedSkillScores(skill, team, storageKey).filter(
      (skillScore) => skillScore.player.shirtNumber === player.shirtNumber
    );
    return skillScores.length > 0 ? skillScores[0] : null;
  }

  pushCachedSkillScoresToServer(
    allSkills: Observable<Skill[]>,
    storageKey: string,
    updateSkillScore: (score: T) => Observable<T>,
    createSkillScore: (score: T, skill: Skill) => Observable<T>
  ): void {
    allSkills.pipe(take(1)).subscribe((skills) => {
      let observables: Observable<T>[] = [];
      this.cacheService.getCache(storageKey).forEach((skillScore) => {
        if (this.shouldUpdate(skillScore)) {
          observables.push(
            updateSkillScore(skillScore).pipe(
              catchError((error) => of(skillScore))
            )
          );
        } else {
          const skill = skills.find(
            (s) => s._links.self.href === skillScore._links.skill.href
          ) as Skill;
          observables.push(
            createSkillScore(skillScore, skill).pipe(
              catchError((error) => of(skillScore))
            )
          );
        }
      });
      forkJoin(observables).subscribe((value) =>
        // Hint: items get fresh cacheIDs.
        // Only set new cacheID when no cacheID is available doesn't help because we have here
        // the skill result values from the server which does not have the cacheID persisted.
        this.cacheService.replaceCache(value, storageKey)
      );
    });
  }

  private shouldUpdate(skillScore: T) {
    return skillScore._links && skillScore._links.self;
  }
}
