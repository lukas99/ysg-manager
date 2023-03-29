import { Component, OnDestroy, OnInit } from '@angular/core';
import { Skill, SkillRating, Team } from '../../../types';
import { SkillRatingsService } from '../../../core/services/skill-ratings.service';
import { SkillTypeService } from '../../../core/services/skill-type.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingDelayIndicator } from '../../../shared/loading-delay/loading-delay-indicator';
import { combineLatest, Subject } from 'rxjs';
import { SkillsService } from '../../../core/services/skills.service';
import { TeamsService } from '../../../core/services/teams.service';
import { flatMap, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'ysg-rating-list',
  templateUrl: './rating-list.component.html',
  styleUrls: ['./rating-list.component.css']
})
export class RatingListComponent implements OnInit, OnDestroy {
  private destroy = new Subject<void>();
  selectedSkill!: Skill;
  selectedTeam!: Team;
  skillRatings: SkillRating[] = [];
  loadingIndicator = new LoadingDelayIndicator();

  constructor(
    private skillsService: SkillsService,
    private teamsService: TeamsService,
    private skillRatingsService: SkillRatingsService,
    private skillTypeService: SkillTypeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const skillId = Number(this.route.snapshot.paramMap.get('skillId'));
    const teamId = Number(this.route.snapshot.paramMap.get('teamId'));

    combineLatest([
      this.loadingIndicator.startLoading(),
      this.skillsService.getSkill(skillId),
      this.teamsService.getTeam(teamId)
    ])
      .pipe(
        takeUntil(this.destroy),
        tap(([loading, skill, team]) => {
          this.selectedSkill = skill;
          this.selectedTeam = team;
        }),
        flatMap(([loading, skill, team]) =>
          this.skillRatingsService.getSkillRatingsBySkillAndTeam(skill, team)
        )
      )
      .subscribe((skillRatings) => {
        this.skillRatings = skillRatings;
        this.loadingIndicator.finishLoading();
      });
  }

  editRating(skillRating: SkillRating) {
    this.navigateToDetailView(skillRating.id);
  }

  createRating() {
    this.navigateToDetailView(null);
  }

  private navigateToDetailView(skillRatingId: number | null) {
    if (this.skillTypeService.canRecordRatingForSkill(this.selectedSkill)) {
      const commands = [
        'skillsonice',
        'skills',
        this.selectedSkill.id,
        'teams',
        this.selectedTeam.id,
        'ratingdetail'
      ];
      if (skillRatingId !== null) {
        commands.push(skillRatingId);
      }
      this.router.navigate(
        commands,
        { queryParamsHandling: 'merge' } // to preserve isSkillChef
      );
    }
  }

  navigateBack() {
    this.router.navigate(
      ['skillsonice', 'skills', this.selectedSkill.id, 'teams'],
      { queryParamsHandling: 'merge' } // to preserve isSkillChef
    );
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
