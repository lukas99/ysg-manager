import {
  Player,
  PlayerPosition,
  Skill,
  SkillResult,
  Team
} from '../../../types';
import { SkillResultsService } from '../../../core/services/skill-results.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Directive, OnDestroy, OnInit } from '@angular/core';
import { SkillTypeService } from '../../../core/services/skill-type.service';
import { defaultIfEmpty, flatMap, map, take, takeUntil } from 'rxjs/operators';
import { combineLatest, forkJoin, Observable, Subject } from 'rxjs';
import { LoadingDelayIndicator } from '../../../shared/loading-delay/loading-delay-indicator';
import { SkillsService } from '../../../core/services/skills.service';
import { TeamsService } from '../../../core/services/teams.service';

/**
 * Base class for skill result detail components.
 */
@Directive()
export abstract class ResultDetailModel implements OnInit, OnDestroy {
  private destroy = new Subject<void>();
  selectedSkill!: Skill;
  selectedTeam!: Team;
  skillResult!: SkillResult;
  stopWatchRunning: boolean = false;
  stopWatchEditing: boolean = false;
  disablePlayerPositionToggle = false;
  loadingIndicator = new LoadingDelayIndicator();

  constructor(
    protected skillsService: SkillsService,
    protected teamsService: TeamsService,
    protected skillResultsService: SkillResultsService,
    protected skillTypeService: SkillTypeService,
    protected router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const skillId = Number(this.route.snapshot.paramMap.get('skillId'));
    const teamId = Number(this.route.snapshot.paramMap.get('teamId'));

    const resultId = this.route.snapshot.paramMap.get('resultId');
    const skillResultId = resultId === null ? null : Number(resultId);

    combineLatest([
      this.loadingIndicator.startLoading(),
      this.skillsService.getSkill(skillId),
      this.teamsService.getTeam(teamId)
    ])
      .pipe(takeUntil(this.destroy))
      .subscribe(([loading, skill, team]) => {
        this.selectedSkill = skill;
        this.selectedTeam = team;

        let singlePossiblePosition =
          this.getSinglePossiblePlayerPosition(skill);
        this.disablePlayerPositionToggle = !!singlePossiblePosition;

        if (skillResultId !== null) {
          // empty object if no value present
          this.skillResultsService
            .getSkillResult(skillResultId)
            .subscribe((skillResult) => (this.skillResult = skillResult));
        } else {
          this.skillResult = {
            time: 0,
            failures: 0,
            points: 0,
            player: {
              team: this.selectedTeam,
              position: singlePossiblePosition || PlayerPosition.SKATER,
              _links: { team: this.selectedTeam._links.self }
            } as Player,
            _links: { skill: this.selectedSkill._links.self }
          } as SkillResult;
        }

        this.loadingIndicator.finishLoading();
      });
  }

  private getSinglePossiblePlayerPosition(skill: Skill): PlayerPosition | null {
    let playerResults = this.skillTypeService.isWithResults(
      skill.typeForPlayers
    );
    let goalieResults = this.skillTypeService.isWithResults(
      skill.typeForGoaltenders
    );
    if (playerResults && !goalieResults) {
      return PlayerPosition.SKATER;
    } else if (!playerResults && goalieResults) {
      return PlayerPosition.GOALTENDER;
    } else {
      return null;
    }
  }

  playerChanged() {
    forkJoin({
      loading: this.loadingIndicator.startLoading(),
      resultForSkillExists: this.resultForSkillExists()
    }).subscribe(({ resultForSkillExists }) => {
      if (resultForSkillExists) {
        this.skillResult.player.shirtNumber = 0;
        this.showAlertDialogResultForSkillAlreadyExists();
      }
      this.loadingIndicator.finishLoading();
    });
  }

  delete() {
    forkJoin({
      loading: this.loadingIndicator.startLoading(),
      delete: this.skillResultsService.deleteSkillResult(this.skillResult)
    }).subscribe(() => {
      this.loadingIndicator.finishLoading();
      this.navigateToResultList();
    });
  }

  cancel() {
    this.navigateToResultList();
  }

  save() {
    forkJoin({
      loading: this.loadingIndicator.startLoading(),
      resultForSkillExists: this.resultForSkillExists()
    }).subscribe(({ resultForSkillExists }) => {
      if (resultForSkillExists) {
        // check for existing result although check is also done when player shirt number has changed
        // check again here in case component <ysg-player> would be used without (playerChange)
        // output validation
        this.showAlertDialogResultForSkillAlreadyExists();
        this.loadingIndicator.finishLoading();
        return;
      }
      if (this.resultExists()) {
        this.skillResultsService
          .updateSkillResult(this.skillResult)
          .subscribe(() => {
            this.loadingIndicator.finishLoading();
            this.navigateToResultList();
          });
      } else {
        this.skillResultsService
          .createSkillResult(this.skillResult, this.selectedSkill)
          .subscribe(() => {
            this.loadingIndicator.finishLoading();
            this.navigateToResultList();
          });
      }
    });
  }

  protected resultExists(): boolean {
    return !!this.skillResult.id;
  }

  private navigateToResultList() {
    this.router.navigate(
      [
        'skillsonice',
        'skills',
        this.selectedSkill.id,
        'teams',
        this.selectedTeam.id,
        'results'
      ],
      { queryParamsHandling: 'merge' } // to preserve isSkillChef
    );
  }

  private resultForSkillExists(): Observable<boolean> {
    return this.skillResultsService
      .getSkillResultsBySkillAndTeamAndPlayerShirtNumber(
        this.selectedSkill,
        this.selectedTeam,
        this.skillResult.player.shirtNumber
      )
      .pipe(
        flatMap((list) => list),
        take(1),
        map((existingResult) => {
          const isCurrentRating =
            !!this.skillResult._links &&
            !!this.skillResult._links.self &&
            this.skillResult._links.self.href ===
              existingResult?._links.self.href;
          return !isCurrentRating; // allow to update own result (this.skillResult)
        }),
        defaultIfEmpty(false)
      );
  }

  showAlertDialogResultForSkillAlreadyExists() {
    window.alert(
      'Ein Resultat für diesen Spieler und für diesen Skill existiert bereits!'
    );
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
