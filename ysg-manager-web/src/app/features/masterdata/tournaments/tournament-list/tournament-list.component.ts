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
        },
        {
          field: 'active',
          headerName: this.translateService.instant('TOURNAMENT_ACTIVE'),
          cellRenderer: (params) => this.translateActive(params.value),
          filterValueGetter: (params) =>
            this.translateActive(params.data.active)
        }
      ],
      crudService: tournamentsService,
      routerDetailUrl: '/tournaments/detail'
    };
  }

  private translateActive(active: boolean) {
    return active ? 'X' : '';
  }
}
