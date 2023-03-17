import { Component, OnInit } from '@angular/core';
import { SkillsService } from '../../../core/services/skills.service';
import { forkJoin, Subject } from 'rxjs';
import { Skill, SkillType } from '../../../types';
import { Router } from '@angular/router';
import { SkillsOnIceStateService } from '../../../core/services/skills-on-ice-state.service';
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
    private stateService: SkillsOnIceStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.stateService
      .isSkillChefObservable()
      .pipe(takeUntil(this.destroy))
      .subscribe((isSkillChef) => (this.isSkillChef = isSkillChef));
    this.stateService
      .isRoleSelectedObservable()
      .pipe(takeUntil(this.destroy))
      .subscribe((isRoleSelected) => (this.isRoleSelected = isRoleSelected));
    forkJoin({
      loading: this.loadingIndicator.startLoading(),
      skills: this.skillsService.getSkills()
    })
      .pipe(takeUntil(this.destroy))
      .subscribe(({ skills }) => {
        this.skills = skills;
        this.loadingIndicator.finishLoading();
      });
  }

  roleToggleClicked(isSkillChef: boolean) {
    this.stateService.setIsRoleSelected(true);
    this.stateService.setIsSkillChef(isSkillChef);
  }

  showSkill(skill: Skill): boolean {
    if (this.stateService.isSkillChef()) {
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
    this.stateService.setSelectedSkill(skill);
    this.router.navigateByUrl('skillsonice/teamselection');
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
