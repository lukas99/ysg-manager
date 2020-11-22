import { Component } from '@angular/core';
import { TournamentsService } from '../../../../core/services/tournaments.service';
import { CrudListOptions } from '../../../../shared/crud/crud-list/crud-list.component';
import { TranslateService } from '@ngx-translate/core';

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
      headers: [
        {
          key: 'name',
          title: this.translateService.instant('TOURNAMENT_NAME')
        },
        {
          key: 'dateDescription',
          title: this.translateService.instant('TOURNAMENT_DATE_DESCRIPTION')
        }
      ],
      crudService: tournamentsService,
      routerDetailUrl: '/masterdata/tournaments/detail'
    };
  }
}
