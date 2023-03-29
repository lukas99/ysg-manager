import { Component, OnInit } from '@angular/core';
import { SkillsService } from '../../../core/services/skills.service';
import { combineLatest, Subject } from 'rxjs';
import { Skill, SkillType } from '../../../types';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingDelayIndicator } from '../../../shared/loading-delay/loading-delay-indicator';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ysg-skill-selection',
  templateUrl: './skill-selection.component.html',
  styleUrls: ['./skill-selection.component.css']
})
export class SkillSelectionComponent implements OnInit {
  private destroy = new Subject<void>();
  skills: Skill[] = [];
  isSkillChef: boolean = false;
  isRoleSelected: boolean = false;
  loadingIndicator = new LoadingDelayIndicator();

  constructor(
    private skillsService: SkillsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const isSkillChef = this.route.snapshot.queryParamMap.get('isSkillChef');
    this.isSkillChef = isSkillChef === 'true';
    this.isRoleSelected = isSkillChef !== null;

    combineLatest([
      this.loadingIndicator.startLoading(),
      this.skillsService.getSkills()
    ])
      .pipe(takeUntil(this.destroy))
      .subscribe(([loading, skills]) => {
        this.skills = skills;
        this.loadingIndicator.finishLoading();
      });
  }

  roleToggleClicked(isSkillChef: boolean) {
    this.isRoleSelected = true;
    this.isSkillChef = isSkillChef;
  }

  showSkill(skill: Skill): boolean {
    if (this.isSkillChef) {
      return (
        this.skillTypeNeedsResults(skill.typeForPlayers) ||
        this.skillTypeNeedsResults(skill.typeForGoaltenders)
      );
    } else {
      // skill expert
      return (
        this.skillTypeNeedsRatings(skill.typeForPlayers) ||
        this.skillTypeNeedsRatings(skill.typeForGoaltenders)
      );
    }
  }

  private skillTypeNeedsResults(skillType: SkillType): boolean {
    return (
      skillType === SkillType.POINTS ||
      skillType === SkillType.TIME ||
      skillType === SkillType.TIME_WITH_POINTS ||
      skillType === SkillType.TIME_WITH_RATING
    );
  }

  private skillTypeNeedsRatings(skillType: SkillType): boolean {
    return (
      skillType === SkillType.RATING || skillType === SkillType.TIME_WITH_RATING
    );
  }

  skillSelected(skill: Skill) {
    this.router.navigate(['skillsonice', 'skills', skill.id, 'teams'], {
      queryParams: { isSkillChef: this.isSkillChef },
      queryParamsHandling: 'merge'
    });
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
