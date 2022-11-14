import { Component, OnInit } from '@angular/core';
import { Skill, SkillRating, Team } from '../../../types';
import { SkillsOnIceStateService } from '../../../core/services/skills-on-ice-state.service';
import { SkillRatingsService } from '../../../core/services/skill-ratings.service';
import { SkillTypeService } from '../../../core/services/skill-type.service';
import { Router } from '@angular/router';

interface SkillRatingView extends SkillRating {
  isUploaded: boolean;
}

@Component({
  selector: 'ysg-rating-list',
  templateUrl: './rating-list.component.html',
  styleUrls: ['./rating-list.component.css']
})
export class RatingListComponent implements OnInit {
  selectedSkill!: Skill;
  selectedTeam!: Team;
  skillRatings: SkillRatingView[] = [];

  constructor(
    private stateService: SkillsOnIceStateService,
    private skillRatingsService: SkillRatingsService,
    private skillTypeService: SkillTypeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.selectedSkill = this.stateService.getSelectedSkill();
    this.selectedTeam = this.stateService.getSelectedTeam();

    this.skillRatings = this.skillRatingsService
      .getCachedSkillRatings(this.selectedSkill, this.selectedTeam)
      .map((skillRating) => {
        let skillRatingView = skillRating as SkillRatingView;
        skillRatingView.isUploaded = this.isUploaded(skillRating);
        return skillRatingView;
      });
  }

  private isUploaded(skillRating: SkillRating): boolean {
    return !!skillRating._links.self;
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
