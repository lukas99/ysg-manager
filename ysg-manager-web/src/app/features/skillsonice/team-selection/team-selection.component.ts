import { Component, OnInit } from '@angular/core';
import { SkillsOnIceStateService } from '../../../core/services/skills-on-ice-state.service';
import { Team } from '../../../types';
import { Router } from '@angular/router';
import { TeamsService } from '../../../core/services/teams.service';
import { combineLatest, Subject } from 'rxjs';
import { LoadingDelayIndicator } from '../../../shared/loading-delay/loading-delay-indicator';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ysg-team-selection',
  templateUrl: './team-selection.component.html',
  styleUrls: ['./team-selection.component.css']
})
export class TeamSelectionComponent implements OnInit {
  private destroy = new Subject<void>();
  teams: Team[] = [];
  loadingIndicator = new LoadingDelayIndicator();

  constructor(
    private teamsService: TeamsService,
    private stateService: SkillsOnIceStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.loadingIndicator.startLoading(),
      this.teamsService.getTeams()
    ])
      .pipe(takeUntil(this.destroy))
      .subscribe(([loading, teams]) => {
        this.teams = teams;
        this.loadingIndicator.finishLoading();
      });
  }

  teamSelected(team: Team) {
    this.stateService.setSelectedTeam(team);
    this.navigate();
  }

  private navigate() {
    if (this.stateService.isSkillChef()) {
      this.router.navigateByUrl('skillsonice/resultlist');
    } else {
      this.router.navigateByUrl('skillsonice/ratinglist');
    }
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
