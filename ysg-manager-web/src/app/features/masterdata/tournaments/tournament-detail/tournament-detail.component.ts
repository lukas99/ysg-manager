import { Component } from '@angular/core';
import { TournamentsService } from '../../../../core/services/tournaments.service';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { CrudDetailOptions } from '../../../../shared/crud/crud-detail/crud-detail.component';

@Component({
  selector: 'ysg-tournament-detail',
  templateUrl: 'tournament-detail.component.html',
  styleUrls: []
})
export class TournamentDetailComponent {
  crudDetailOptions: CrudDetailOptions;

  constructor(
    private tournamentsService: TournamentsService,
    private formBuilder: UntypedFormBuilder
  ) {
    this.crudDetailOptions = {
      form: this.formBuilder.group({
        name: ['', Validators.required],
        dateDescription: [''],
        _links: ['']
      }),
      crudService: tournamentsService,
      routerListUrl: '/tournaments'
    };
  }
}
