import { Component, OnInit } from '@angular/core';
import { SkillsService } from '../../../core/services/skills.service';
import { forkJoin, Observable, of } from 'rxjs';
import { Skill, SkillType, Team } from '../../../types';
import { TeamsService } from '../../../core/services/teams.service';
import { Router } from '@angular/router';
import { SkillsOnIceStateService } from '../../../core/services/skills-on-ice-state.service';
import { SkillResultsService } from '../../../core/services/skill-results.service';
import { SkillRatingsService } from '../../../core/services/skill-ratings.service';
import { concatMap, reduce } from 'rxjs/operators';
import { SkillScoresPushResult } from '../../../core/services/skill-scores.service';

@Component({
  selector: 'ysg-skill-selection',
  templateUrl: './skill-selection.component.html',
  styleUrls: ['./skill-selection.component.css']
})
export class SkillSelectionComponent implements OnInit {
  skills$: Observable<Skill[]> = of([]);
  teams$: Observable<Team[]> = of([]);
  isSkillChef$: Observable<boolean> = of(false);

  isRoleSelected: boolean = false;

  constructor(
    private skillsService: SkillsService,
    private teamsService: TeamsService,
    private skillResultsService: SkillResultsService,
    private skillRatingsService: SkillRatingsService,
    private stateService: SkillsOnIceStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.skills$ = this.skillsService.getSkills();
    this.teams$ = this.teamsService.getTeams();
    this.isSkillChef$ = this.stateService.isSkillChefObservable();
  }

  roleToggleClicked(isSkillChef: boolean) {
    this.isRoleSelected = true;
    this.stateService.setSkillChef(isSkillChef);
  }

  showSkill(skill: Skill): boolean {
    if (this.stateService.isSkillChef()) {
      return (
        this.skillTypeNeedsResults(skill.typeForPlayers) ||
        this.skillTypeNeedsResults(skill.typeForGoaltenders)
      );
    } else {
      // skill expert
      return (
        this.skillTypeNeedsRatings(skill.typeForPlayers) ||
        this.skillTypeNeedsRatings(skill.typeForGoaltenders)
      );
    }
  }

  private skillTypeNeedsResults(skillType: SkillType): boolean {
    return (
      skillType === SkillType.POINTS ||
      skillType === SkillType.TIME ||
      skillType === SkillType.TIME_WITH_POINTS ||
      skillType === SkillType.TIME_WITH_RATING
    );
  }

  private skillTypeNeedsRatings(skillType: SkillType): boolean {
    return (
      skillType === SkillType.RATING || skillType === SkillType.TIME_WITH_RATING
    );
  }

  skillSelected(skill: Skill) {
    this.stateService.setSelectedSkill(skill);
    this.router.navigateByUrl('skillsonice/teamselection');
  }

  uploadSkillScores() {
    this.doUploadSkillScores().subscribe((pushResult) => {
      const total =
        pushResult.updateSuccessAmount +
        pushResult.updateFailedAmount +
        pushResult.creationSuccessAmount +
        pushResult.creationFailedAmount;
      window.alert(`
      Total uploaded skill scores: ${total}
      - Creation success: ${pushResult.creationSuccessAmount}
      - Creation failed: ${pushResult.creationFailedAmount}
      - Update success: ${pushResult.updateSuccessAmount}
      - Update failed: ${pushResult.updateFailedAmount}
      `);
    });
  }

  private doUploadSkillScores(): Observable<SkillScoresPushResult> {
    return forkJoin([
      this.skillResultsService.pushCachedSkillResultsToServer(),
      this.skillRatingsService.pushCachedSkillRatingsToServer()
    ]).pipe(
      concatMap((results) => results),
      reduce((totalResult, result) => {
        totalResult.updateSuccessAmount += result.updateSuccessAmount;
        totalResult.updateFailedAmount += result.updateFailedAmount;
        totalResult.creationSuccessAmount += result.creationSuccessAmount;
        totalResult.creationFailedAmount += result.creationFailedAmount;
        return totalResult;
      })
    );
  }
}
