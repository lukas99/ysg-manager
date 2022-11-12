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

/**
 * Base class for skill result detail components.
 */
@Directive()
export abstract class ResultDetailModel {
  selectedSkill!: Skill;
  selectedTeam!: Team;
  skillResult!: SkillResult;
  stopWatchRunning: boolean = false;

  constructor(
    protected stateService: SkillsOnIceStateService,
    protected skillResultsService: SkillResultsService,
    protected router: Router
  ) {}

  ngOnInit(): void {
    this.selectedSkill = this.stateService.getSelectedSkill();
    this.selectedTeam = this.stateService.getSelectedTeam();

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
          position: PlayerPosition.SKATER,
          _links: { team: this.selectedTeam._links.self }
        } as Player,
        _links: { skill: this.selectedSkill._links.self }
      } as SkillResult;
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
    let existingCacheResult = this.skillResultsService.getCachedSkillResult(
      this.selectedSkill,
      this.selectedTeam,
      this.skillResult.player
    );
    return !!existingCacheResult;
  }

  showAlertDialogResultForSkillAlreadyExists() {
    window.alert(
      'Skill Resultat für diesen Spieler und für diesen Skill existiert bereits!'
    );
  }
}
