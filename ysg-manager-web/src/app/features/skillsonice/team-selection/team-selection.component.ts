import { Component, OnInit } from '@angular/core';
import { Team } from '../../../types';
import { ActivatedRoute, Router } from '@angular/router';
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
  selectedSkillId: string | null = null;
  isSkillChef: boolean = false;
  teams: Team[] = [];
  loadingIndicator = new LoadingDelayIndicator();

  constructor(
    private teamsService: TeamsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.selectedSkillId = this.route.snapshot.paramMap.get('skillId');
    this.isSkillChef =
      this.route.snapshot.queryParamMap.get('isSkillChef') === 'true';

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
    this.navigate(team);
  }

  private navigate(team: Team) {
    if (this.isSkillChef) {
      this.router.navigate(
        [
          'skillsonice',
          'skills',
          this.selectedSkillId,
          'teams',
          team.id,
          'results'
        ],
        { queryParamsHandling: 'merge' } // to preserve isSkillChef
      );
    } else {
      this.router.navigate(
        [
          'skillsonice',
          'skills',
          this.selectedSkillId,
          'teams',
          team.id,
          'ratings'
        ],
        { queryParamsHandling: 'merge' } // to preserve isSkillChef
      );
    }
  }

  navigateBack() {
    this.router.navigate(
      ['skillsonice'],
      { queryParamsHandling: 'merge' } // to preserve isSkillChef
    );
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
