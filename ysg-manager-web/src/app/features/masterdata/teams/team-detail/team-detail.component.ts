import { Component } from '@angular/core';
import { CrudDetailOptions } from '../../../../shared/crud/crud-detail/crud-detail.component';
import { FormBuilder, Validators } from '@angular/forms';
import { TeamsService } from '../../../../core/services/teams.service';

@Component({
  selector: 'ysg-team-detail',
  templateUrl: 'team-detail.component.html',
  styleUrls: ['team-detail.component.css']
})
export class TeamDetailComponent {
  crudDetailOptions: CrudDetailOptions;

  constructor(
    private teamsService: TeamsService,
    private formBuilder: FormBuilder
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
}
