import { Component } from '@angular/core';
import { CrudListOptions } from '../../../../shared/crud/crud-list/crud-list.component';
import { TranslateService } from '@ngx-translate/core';
import { TeamsService } from '../../../../core/services/teams.service';

@Component({
  selector: 'ysg-team-list',
  templateUrl: 'team-list.component.html',
  styleUrls: ['team-list.component.css']
})
export class TeamListComponent {
  crudListOptions: CrudListOptions;

  constructor(
    private teamsService: TeamsService,
    private translateService: TranslateService
  ) {
    this.crudListOptions = {
      headers: [
        {
          key: 'name',
          title: this.translateService.instant('TEAM_NAME')
        }
      ],
      crudService: teamsService,
      routerDetailUrl: '/masterdata/teams/detail'
    };
  }
}
