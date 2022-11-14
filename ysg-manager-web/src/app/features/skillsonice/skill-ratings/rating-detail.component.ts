import { Component, OnInit } from '@angular/core';
import {
  Player,
  PlayerPosition,
  Skill,
  SkillRating,
  Team
} from '../../../types';
import { SkillsOnIceStateService } from '../../../core/services/skills-on-ice-state.service';
import { SkillRatingsService } from '../../../core/services/skill-ratings.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ysg-rating-detail',
  templateUrl: './rating-detail.component.html',
  styleUrls: ['./rating-detail.component.css']
})
export class RatingDetailComponent implements OnInit {
  selectedSkill!: Skill;
  selectedTeam!: Team;
  skillRating!: SkillRating;

  constructor(
    protected stateService: SkillsOnIceStateService,
    protected skillRatingsService: SkillRatingsService,
    protected router: Router
  ) {}

  ngOnInit(): void {
    this.selectedSkill = this.stateService.getSelectedSkill();
    this.selectedTeam = this.stateService.getSelectedTeam();

    if (this.shouldUpdate()) {
      // empty object if no value present
      this.skillRating = this.skillRatingsService.getSelectedItemValue();
    } else {
      this.skillRating = {
        score: 0,
        player: {
          team: this.selectedTeam,
          position: PlayerPosition.SKATER,
          _links: { team: this.selectedTeam._links.self }
        } as Player,
        _links: { skill: this.selectedSkill._links.self }
      } as SkillRating;
    }
  }

  private shouldUpdate(): boolean {
    // all values of selected item are undefined, we use score here for testing
    return this.skillRatingsService.getSelectedItemValue().score;
  }

  playerChanged() {
    if (this.ratingForSkillExists()) {
      this.skillRating.player.shirtNumber = 0;
      this.showAlertDialogRatingForSkillAlreadyExists();
    }
  }

  delete() {
    this.skillRatingsService.removeSkillRatingFromCache(this.skillRating);
    this.navigateToRatingList();
  }

  cancel() {
    this.navigateToRatingList();
  }

  save() {
    if (this.ratingForSkillExists()) {
      // check for existing rating although check is also done when player shirt number has changed
      // check again here in case component <ysg-player> would be used without (playerChange)
      // output validation
      this.showAlertDialogRatingForSkillAlreadyExists();
      return;
    }
    if (this.shouldUpdate()) {
      this.skillRatingsService.updateSkillRatingInCache(this.skillRating);
    } else {
      this.skillRatingsService.addSkillRatingToCache(this.skillRating);
    }
    this.navigateToRatingList();
  }

  private navigateToRatingList() {
    this.skillRatingsService.removeSelectedItem();
    this.router.navigateByUrl('skillsonice/ratinglist');
  }

  private ratingForSkillExists(): boolean {
    const existingCacheRating = this.skillRatingsService.getCachedSkillRating(
      this.selectedSkill,
      this.selectedTeam,
      this.skillRating.player
    );
    if (existingCacheRating) {
      const isCurrentRating =
        !!this.skillRating.cacheId &&
        this.skillRating.cacheId === existingCacheRating?.cacheId;
      return !isCurrentRating; // allow to update own rating (this.skillRating)
    } else {
      return false;
    }
  }

  showAlertDialogRatingForSkillAlreadyExists() {
    window.alert(
      'Eine Bewertung für diesen Spieler und für diesen Skill existiert bereits!'
    );
  }
}
