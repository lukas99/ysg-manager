import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SkillResultsService } from '../../../core/services/skill-results.service';
import { Skill, SkillResult, SkillType, Team } from '../../../types';
import { SkillTypeService } from '../../../core/services/skill-type.service';
import { combineLatest, Subject } from 'rxjs';
import { LoadingDelayIndicator } from '../../../shared/loading-delay/loading-delay-indicator';
import { SkillsService } from '../../../core/services/skills.service';
import { TeamsService } from '../../../core/services/teams.service';
import { tap, flatMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ysg-result-list',
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.css']
})
export class ResultListComponent implements OnInit, OnDestroy {
  private destroy = new Subject<void>();
  selectedSkill!: Skill;
  selectedTeam!: Team;
  skillResults: SkillResult[] = [];
  showTime = false;
  showPoints = false;
  loadingIndicator = new LoadingDelayIndicator();

  constructor(
    private skillsService: SkillsService,
    private teamsService: TeamsService,
    private skillResultsService: SkillResultsService,
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
          this.showTime = this.skillTypeService.isWithTime(this.selectedSkill);
          this.showPoints = this.skillTypeService.isWithPoints(
            this.selectedSkill
          );
        }),
        flatMap(([loading, skill, team]) =>
          this.skillResultsService.getSkillResultsBySkillAndTeam(skill, team)
        )
      )
      .subscribe((skillResults) => {
        this.skillResults = skillResults;
        this.loadingIndicator.finishLoading();
      });
  }

  editResult(skillResult: SkillResult) {
    this.navigateToDetailView(skillResult.id);
  }

  createResult() {
    this.navigateToDetailView(null);
  }

  private navigateToDetailView(skillResultId: number | null) {
    const skillTypeForPlayers = this.selectedSkill.typeForPlayers;
    const skillName = this.selectedSkill.name;
    const navigationCommands = [
      'skillsonice',
      'skills',
      this.selectedSkill.id,
      'teams',
      this.selectedTeam.id
    ];
    if (
      skillTypeForPlayers === SkillType.TIME_WITH_RATING ||
      skillTypeForPlayers === SkillType.TIME
    ) {
      if ('hit the road' === skillName.toLowerCase()) {
        navigationCommands.push('resultdetailfortimemanual');
      } else {
        navigationCommands.push('resultdetailfortime');
      }
    } else if (skillTypeForPlayers === SkillType.TIME_WITH_POINTS) {
      navigationCommands.push('resultdetailfortimewithpoints');
    } else if (skillTypeForPlayers === SkillType.POINTS) {
      navigationCommands.push('resultdetailforpoints');
    }
    if (skillResultId !== null) {
      navigationCommands.push(skillResultId);
    }
    this.router.navigate(
      navigationCommands,
      { queryParamsHandling: 'merge' } // to preserve isSkillChef
    );
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
