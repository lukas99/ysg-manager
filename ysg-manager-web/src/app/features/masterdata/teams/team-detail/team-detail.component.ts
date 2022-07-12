import { Component } from '@angular/core';
import { CrudDetailOptions } from '../../../../shared/crud/crud-detail/crud-detail.component';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { TeamsService } from '../../../../core/services/teams.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ysg-team-detail',
  templateUrl: 'team-detail.component.html',
  styleUrls: []
})
export class TeamDetailComponent {
  crudDetailOptions: CrudDetailOptions;

  constructor(
    private teamsService: TeamsService,
    private formBuilder: UntypedFormBuilder,
    private router: Router
  ) {
    this.crudDetailOptions = {
      form: this.formBuilder.group({
        name: ['', Validators.required],
        _links: ['']
      }),
      crudService: teamsService,
      routerListUrl: '/masterdata/teams'
    };
  }

  navigateToPlayersOfTeam() {
    this.router.navigateByUrl('/masterdata/players');
  }
}
