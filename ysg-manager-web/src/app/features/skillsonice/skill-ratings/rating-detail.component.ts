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
import { SkillTypeService } from '../../../core/services/skill-type.service';
import { forkJoin, Observable } from 'rxjs';
import { defaultIfEmpty, flatMap, map, take } from 'rxjs/operators';
import { LoadingDelayIndicator } from '../../../shared/loading-delay/loading-delay-indicator';

@Component({
  selector: 'ysg-rating-detail',
  templateUrl: './rating-detail.component.html',
  styleUrls: ['./rating-detail.component.css']
})
export class RatingDetailComponent implements OnInit {
  selectedSkill!: Skill;
  selectedTeam!: Team;
  skillRating!: SkillRating;
  disablePlayerPositionToggle = false;
  loadingIndicator = new LoadingDelayIndicator();

  constructor(
    private stateService: SkillsOnIceStateService,
    private skillRatingsService: SkillRatingsService,
    private skillTypeService: SkillTypeService,
    private router: Router
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
      this.skillRating = this.skillRatingsService.getSelectedItemValue();
    } else {
      this.skillRating = {
        score: 0,
        player: {
          team: this.selectedTeam,
          position: singlePossiblePosition || PlayerPosition.SKATER,
          _links: { team: this.selectedTeam._links.self }
        } as Player,
        _links: { skill: this.selectedSkill._links.self }
      } as SkillRating;
    }
  }

  private getSinglePossiblePlayerPosition(skill: Skill): PlayerPosition | null {
    let playerRatings = this.skillTypeService.isWithRatings(
      skill.typeForPlayers
    );
    let goalieRatings = this.skillTypeService.isWithRatings(
      skill.typeForGoaltenders
    );
    if (playerRatings && !goalieRatings) {
      return PlayerPosition.SKATER;
    } else if (!playerRatings && goalieRatings) {
      return PlayerPosition.GOALTENDER;
    } else {
      return null;
    }
  }

  private shouldUpdate(): boolean {
    // all values of selected item are undefined, we use score here for testing
    return this.skillRatingsService.getSelectedItemValue().score;
  }

  playerChanged() {
    forkJoin({
      loading: this.loadingIndicator.startLoading(),
      ratingForSkillExists: this.ratingForSkillExists()
    }).subscribe(({ ratingForSkillExists }) => {
      if (ratingForSkillExists) {
        this.skillRating.player.shirtNumber = 0;
        this.showAlertDialogRatingForSkillAlreadyExists();
      }
      this.loadingIndicator.finishLoading();
    });
  }

  delete() {
    forkJoin({
      loading: this.loadingIndicator.startLoading(),
      delete: this.skillRatingsService.deleteSkillRating(this.skillRating)
    }).subscribe(() => {
      this.loadingIndicator.finishLoading();
      this.navigateToRatingList();
    });
  }

  cancel() {
    this.navigateToRatingList();
  }

  save() {
    forkJoin({
      loading: this.loadingIndicator.startLoading(),
      ratingForSkillExists: this.ratingForSkillExists()
    }).subscribe(({ ratingForSkillExists }) => {
      if (ratingForSkillExists) {
        // check for existing rating although check is also done when player shirt number has changed
        // check again here in case component <ysg-player> would be used without (playerChange)
        // output validation
        this.showAlertDialogRatingForSkillAlreadyExists();
        this.loadingIndicator.finishLoading();
        return;
      }
      if (this.shouldUpdate()) {
        this.skillRatingsService
          .updateSkillRating(this.skillRating)
          .subscribe(() => {
            this.loadingIndicator.finishLoading();
            this.navigateToRatingList();
          });
      } else {
        this.skillRatingsService
          .createSkillRating(this.skillRating, this.selectedSkill)
          .subscribe(() => {
            this.loadingIndicator.finishLoading();
            this.navigateToRatingList();
          });
      }
    });
  }

  private navigateToRatingList() {
    this.skillRatingsService.removeSelectedItem();
    this.router.navigateByUrl('skillsonice/ratinglist');
  }

  private ratingForSkillExists(): Observable<boolean> {
    return this.skillRatingsService
      .getSkillRatingsBySkillAndTeamAndPlayerShirtNumber(
        this.selectedSkill,
        this.selectedTeam,
        this.skillRating.player.shirtNumber
      )
      .pipe(
        flatMap((list) => list),
        take(1),
        map((existingRating) => {
          const isCurrentRating =
            !!this.skillRating._links &&
            !!this.skillRating._links.self &&
            this.skillRating._links.self.href ===
              existingRating?._links.self.href;
          return !isCurrentRating; // allow to update own rating (this.skillRating)
        }),
        defaultIfEmpty(false)
      );
  }

  showAlertDialogRatingForSkillAlreadyExists() {
    window.alert(
      'Eine Bewertung für diesen Spieler und für diesen Skill existiert bereits!'
    );
  }
}
