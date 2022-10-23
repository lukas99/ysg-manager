import { Component, OnInit } from '@angular/core';
import { SkillsService } from '../../../core/services/skills.service';
import { Observable, of } from 'rxjs';
import { Skill, SkillType, Team } from '../../../types';
import { TeamsService } from '../../../core/services/teams.service';
import { Router } from '@angular/router';
import { SkillsOnIceStateService } from '../../../core/services/skills-on-ice-state.service';

@Component({
  selector: 'ysg-skill-selection',
  templateUrl: './skill-selection.component.html',
  styleUrls: ['./skill-selection.component.css']
})
export class SkillSelectionComponent implements OnInit {
  skills$: Observable<Skill[]> = of([]);
  teams$: Observable<Team[]> = of([]);

  isRoleSelected: boolean = false;
  isSkillChef: boolean = false;

  constructor(
    private skillsService: SkillsService,
    private teamsService: TeamsService,
    private stateService: SkillsOnIceStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.skills$ = this.skillsService.getSkills();
    this.teams$ = this.teamsService.getTeams();
  }

  roleToggleClicked() {
    this.isRoleSelected = true;
    this.isSkillChef = !this.isSkillChef;
    this.stateService.setIsSkillChef(this.isSkillChef);
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
    this.stateService.setSelectedSkill(skill);
    this.router.navigateByUrl('skillsonice/teamselection');
  }
}
