import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TeamsService } from '../../../../core/services/teams.service';
import { CrudListOptionsAg } from '../../../../shared/crud/crud-list-aggrid/crud-list-ag.component';

@Component({
  selector: 'ysg-team-list',
  templateUrl: 'team-list.component.html',
  styleUrls: []
})
export class TeamListComponent {
  crudListOptions: CrudListOptionsAg;

  constructor(
    private teamsService: TeamsService,
    private translateService: TranslateService
  ) {
    this.crudListOptions = {
      columnDefs: [
        {
          field: 'name',
          headerName: this.translateService.instant('TEAM_NAME')
        }
      ],
      crudService: teamsService,
      routerDetailUrl: '/masterdata/teams/detail'
    };
  }
}
