import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SkillResultsService } from '../../../core/services/skill-results.service';
import { Skill, SkillResult, Team } from '../../../types';
import { SkillsOnIceStateService } from '../../../core/services/skills-on-ice-state.service';

@Component({
  selector: 'ysg-result-list',
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.css']
})
export class ResultListComponent implements OnInit {
  selectedSkill!: Skill;
  selectedTeam!: Team;

  skillResults: SkillResult[] = [];

  constructor(
    private stateService: SkillsOnIceStateService,
    private skillResultsService: SkillResultsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.selectedSkill = this.stateService.getSelectedSkill();
    this.selectedTeam = this.stateService.getSelectedTeam();

    this.skillResults = this.skillResultsService.getCachedSkillResults(
      this.selectedSkill,
      this.selectedTeam
    );
  }

  editResult(skillResult: SkillResult) {
    this.skillResultsService.setSelectedItem(skillResult);
    this.navigateToDetailView();
  }

  createResult() {
    this.skillResultsService.removeSelectedItem();
    this.navigateToDetailView();
  }

  private navigateToDetailView() {
    this.router.navigateByUrl('skillsonice/resultdetailfortime');
  }
}
