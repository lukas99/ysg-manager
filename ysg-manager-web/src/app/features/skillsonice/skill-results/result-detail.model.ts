import {
  Player,
  PlayerPosition,
  Skill,
  SkillResult,
  Team
} from '../../../types';
import { SkillsOnIceStateService } from '../../../core/services/skills-on-ice-state.service';
import { SkillResultsService } from '../../../core/services/skill-results.service';
import { Router } from '@angular/router';
import { Directive } from '@angular/core';
import { SkillTypeService } from '../../../core/services/skill-type.service';
import { defaultIfEmpty, filter, flatMap, map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

/**
 * Base class for skill result detail components.
 */
@Directive()
export abstract class ResultDetailModel {
  selectedSkill!: Skill;
  selectedTeam!: Team;
  skillResult!: SkillResult;
  stopWatchRunning: boolean = false;
  disablePlayerPositionToggle = false;

  constructor(
    protected stateService: SkillsOnIceStateService,
    protected skillResultsService: SkillResultsService,
    protected skillTypeService: SkillTypeService,
    protected router: Router
  ) {}

  ngOnInit(): void {
    this.selectedSkill = this.stateService.getSelectedSkill();
    this.selectedTeam = this.stateService.getSelectedTeam();

    let singlePossiblePosition = this.getSinglePossiblePlayerPosition(
      this.selectedSkill
    );
    this.disablePlayerPositionToggle = !!singlePossiblePosition;

    if (this.shouldUpdate()) {
      // empty object if no value present
      this.skillResult = this.skillResultsService.getSelectedItemValue();
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

  abstract shouldUpdate(): boolean;

  playerChanged() {
    this.resultForSkillExists()
      .pipe(filter((resultForSkillExists) => resultForSkillExists))
      .subscribe(() => {
        this.skillResult.player.shirtNumber = 0;
        this.showAlertDialogResultForSkillAlreadyExists();
      });
  }

  delete() {
    this.skillResultsService
      .deleteSkillResult(this.skillResult)
      .subscribe(() => this.navigateToResultList());
  }

  cancel() {
    this.navigateToResultList();
  }

  save() {
    this.resultForSkillExists().subscribe((resultForSkillExists) => {
      if (resultForSkillExists) {
        // check for existing result although check is also done when player shirt number has changed
        // check again here in case component <ysg-player> would be used without (playerChange)
        // output validation
        this.showAlertDialogResultForSkillAlreadyExists();
        return;
      }
      if (this.shouldUpdate()) {
        this.skillResultsService
          .updateSkillResult(this.skillResult)
          .subscribe(() => this.navigateToResultList());
      } else {
        this.skillResultsService
          .createSkillResult(this.skillResult, this.selectedSkill)
          .subscribe(() => this.navigateToResultList());
      }
    });
  }

  private navigateToResultList() {
    this.skillResultsService.removeSelectedItem();
    this.router.navigateByUrl('skillsonice/resultlist');
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
}
