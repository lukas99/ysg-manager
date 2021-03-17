import { Component } from '@angular/core';
import { TournamentsService } from '../../../../core/services/tournaments.service';
import { TranslateService } from '@ngx-translate/core';
import { CrudListOptions } from '../../../../shared/crud/crud-list/crud-list.component';

@Component({
  selector: 'ysg-tournament-list',
  templateUrl: 'tournament-list.component.html',
  styleUrls: []
})
export class TournamentListComponent {
  crudListOptions: CrudListOptions;

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
