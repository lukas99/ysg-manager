import { Component, OnInit } from '@angular/core';
import { Skill, SkillRating, Team } from '../../../types';
import { SkillsOnIceStateService } from '../../../core/services/skills-on-ice-state.service';
import { SkillRatingsService } from '../../../core/services/skill-ratings.service';
import { SkillTypeService } from '../../../core/services/skill-type.service';
import { Router } from '@angular/router';
import { LoadingDelayIndicator } from '../../../shared/loading-delay/loading-delay-indicator';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'ysg-rating-list',
  templateUrl: './rating-list.component.html',
  styleUrls: ['./rating-list.component.css']
})
export class RatingListComponent implements OnInit {
  selectedSkill!: Skill;
  selectedTeam!: Team;
  skillRatings: SkillRating[] = [];
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

    forkJoin({
      loading: this.loadingIndicator.startLoading(),
      skillRatings: this.skillRatingsService.getSkillRatingsBySkillAndTeam(
        this.selectedSkill,
        this.selectedTeam
      )
    }).subscribe(({ skillRatings }) => {
      this.skillRatings = skillRatings;
      this.loadingIndicator.finishLoading();
    });
  }

  editRating(skillRating: SkillRating) {
    this.skillRatingsService.setSelectedItem(skillRating);
    this.navigateToDetailView();
  }

  createRating() {
    this.skillRatingsService.removeSelectedItem();
    this.navigateToDetailView();
  }

  private navigateToDetailView() {
    if (this.skillTypeService.canRecordRatingForSkill(this.selectedSkill)) {
      this.router.navigateByUrl('skillsonice/ratingdetail');
    }
  }
}
