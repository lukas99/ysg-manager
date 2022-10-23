import { Component, OnInit } from '@angular/core';
import { SkillsOnIceStateService } from '../../../core/services/skills-on-ice-state.service';
import { Team } from '../../../types';
import { Router } from '@angular/router';
import { TeamsService } from '../../../core/services/teams.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'ysg-team-selection',
  templateUrl: './team-selection.component.html',
  styleUrls: ['./team-selection.component.css']
})
export class TeamSelectionComponent implements OnInit {
  teams$: Observable<Team[]> = of([]);

  constructor(
    private teamsService: TeamsService,
    private stateService: SkillsOnIceStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.teams$ = this.teamsService.getTeams();
  }

  teamSelected(team: Team) {
    this.stateService.setSelectedTeam(team);
    this.router.navigateByUrl('skillsonice/todo');
  }
}
