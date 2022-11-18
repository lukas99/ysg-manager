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
    if (this.resultForSkillExists()) {
      this.skillResult.player.shirtNumber = 0;
      this.showAlertDialogResultForSkillAlreadyExists();
    }
  }

  delete() {
    this.skillResultsService.removeSkillResultFromCache(this.skillResult);
    this.navigateToResultList();
  }

  cancel() {
    this.navigateToResultList();
  }

  save() {
    if (this.resultForSkillExists()) {
      // check for existing result although check is also done when player shirt number has changed
      // check again here in case component <ysg-player> would be used without (playerChange)
      // output validation
      this.showAlertDialogResultForSkillAlreadyExists();
      return;
    }
    if (this.shouldUpdate()) {
      this.skillResultsService.updateSkillResultInCache(this.skillResult);
    } else {
      this.skillResultsService.addSkillResultToCache(this.skillResult);
    }
    this.navigateToResultList();
  }

  private navigateToResultList() {
    this.skillResultsService.removeSelectedItem();
    this.router.navigateByUrl('skillsonice/resultlist');
  }

  private resultForSkillExists(): boolean {
    const existingCacheResult = this.skillResultsService.getCachedSkillResult(
      this.selectedSkill,
      this.selectedTeam,
      this.skillResult.player
    );
    if (existingCacheResult) {
      const isCurrentRating =
        !!this.skillResult.cacheId &&
        this.skillResult.cacheId === existingCacheResult?.cacheId;
      return !isCurrentRating; // allow to update own result (this.skillResult)
    } else {
      return false;
    }
  }

  showAlertDialogResultForSkillAlreadyExists() {
    window.alert(
      'Ein Resultat für diesen Spieler und für diesen Skill existiert bereits!'
    );
  }
}
