import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SkillResultsService } from '../../../core/services/skill-results.service';
import { Skill, SkillResult, SkillType, Team } from '../../../types';
import { SkillsOnIceStateService } from '../../../core/services/skills-on-ice-state.service';
import { SkillTypeService } from '../../../core/services/skill-type.service';
import { forkJoin } from 'rxjs';
import { LoadingDelayIndicator } from '../../../shared/loading-delay/loading-delay-indicator';

@Component({
  selector: 'ysg-result-list',
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.css']
})
export class ResultListComponent implements OnInit {
  selectedSkill!: Skill;
  selectedTeam!: Team;
  skillResults: SkillResult[] = [];
  showTime = false;
  showPoints = false;
  loadingIndicator = new LoadingDelayIndicator();

  constructor(
    private stateService: SkillsOnIceStateService,
    private skillResultsService: SkillResultsService,
    private skillTypeService: SkillTypeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.selectedSkill = this.stateService.getSelectedSkill();
    this.selectedTeam = this.stateService.getSelectedTeam();
    this.showTime = this.skillTypeService.isWithTime(this.selectedSkill);
    this.showPoints = this.skillTypeService.isWithPoints(this.selectedSkill);

    forkJoin({
      loading: this.loadingIndicator.startLoading(),
      skillResults: this.skillResultsService.getSkillResultsBySkillAndTeam(
        this.selectedSkill,
        this.selectedTeam
      )
    }).subscribe(({ skillResults }) => {
      this.skillResults = skillResults;
      this.loadingIndicator.finishLoading();
    });
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
    const skillTypeForPlayers = this.selectedSkill.typeForPlayers;
    const skillName = this.selectedSkill.name;
    let url = '';
    if (
      skillTypeForPlayers === SkillType.TIME_WITH_RATING ||
      skillTypeForPlayers === SkillType.TIME
    ) {
      if ('hit the road' === skillName.toLowerCase()) {
        url = 'skillsonice/resultdetailfortimemanual';
      } else {
        url = 'skillsonice/resultdetailfortime';
      }
    } else if (skillTypeForPlayers === SkillType.TIME_WITH_POINTS) {
      url = 'skillsonice/resultdetailfortimewithpoints';
    } else if (skillTypeForPlayers === SkillType.POINTS) {
      url = 'skillsonice/resultdetailforpoints';
    }
    this.router.navigateByUrl(url);
  }
}
