import { Component } from '@angular/core';
import { TournamentsService } from '../../../../core/services/tournaments.service';
import { TranslateService } from '@ngx-translate/core';
import { CrudListOptionsAg } from '../../../../shared/crud/crud-list-aggrid/crud-list-ag.component';

@Component({
  selector: 'ysg-tournament-list',
  templateUrl: 'tournament-list.component.html',
  styleUrls: []
})
export class TournamentListComponent {
  crudListOptions: CrudListOptionsAg;

  constructor(
    private tournamentsService: TournamentsService,
    private translateService: TranslateService
  ) {
    this.crudListOptions = {
      columnDefs: [
        {
          field: 'name',
          headerName: this.translateService.instant('TOURNAMENT_NAME')
        },
        {
          field: 'dateDescription',
          headerName: this.translateService.instant(
            'TOURNAMENT_DATE_DESCRIPTION'
          ),
          sort: 'asc'
        }
      ],
      crudService: tournamentsService,
      routerDetailUrl: '/masterdata/tournaments/detail'
    };
  }
}
