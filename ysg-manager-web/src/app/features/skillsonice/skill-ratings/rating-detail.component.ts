import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  Player,
  PlayerPosition,
  Skill,
  SkillRating,
  Team
} from '../../../types';
import { SkillRatingsService } from '../../../core/services/skill-ratings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SkillTypeService } from '../../../core/services/skill-type.service';
import { combineLatest, forkJoin, Observable, Subject } from 'rxjs';
import { defaultIfEmpty, flatMap, map, take, takeUntil } from 'rxjs/operators';
import { LoadingDelayIndicator } from '../../../shared/loading-delay/loading-delay-indicator';
import { SkillsService } from '../../../core/services/skills.service';
import { TeamsService } from '../../../core/services/teams.service';

@Component({
  selector: 'ysg-rating-detail',
  templateUrl: './rating-detail.component.html',
  styleUrls: ['./rating-detail.component.css']
})
export class RatingDetailComponent implements OnInit, OnDestroy {
  private destroy = new Subject<void>();
  selectedSkill!: Skill;
  selectedTeam!: Team;
  skillRating!: SkillRating;
  disablePlayerPositionToggle = false;
  loadingIndicator = new LoadingDelayIndicator();

  constructor(
    protected skillsService: SkillsService,
    protected teamsService: TeamsService,
    private skillRatingsService: SkillRatingsService,
    private skillTypeService: SkillTypeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const skillId = Number(this.route.snapshot.paramMap.get('skillId'));
    const teamId = Number(this.route.snapshot.paramMap.get('teamId'));

    const ratingId = this.route.snapshot.paramMap.get('ratingId');
    const skillRatingId = ratingId === null ? null : Number(ratingId);

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

        if (skillRatingId !== null) {
          // empty object if no value present
          this.skillRatingsService
            .getSkillRating(skillRatingId)
            .subscribe((skillRating) => (this.skillRating = skillRating));
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

        this.loadingIndicator.finishLoading();
      });
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

  /**
   * @return Whether the current rating already exists. Returns false in case it's a new rating.
   */
  ratingExists(): boolean {
    return !!this.skillRating.id;
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
      if (this.ratingExists()) {
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
    this.router.navigate(
      [
        'skillsonice',
        'skills',
        this.selectedSkill.id,
        'teams',
        this.selectedTeam.id,
        'ratings'
      ],
      { queryParamsHandling: 'merge' } // to preserve isSkillChef
    );
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

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
