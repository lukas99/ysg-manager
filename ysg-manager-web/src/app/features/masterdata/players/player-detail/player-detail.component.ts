import { Component } from '@angular/core';
import { CrudDetailOptions } from '../../../../shared/crud/crud-detail/crud-detail.component';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { PlayersService } from '../../../../core/services/players.service';
import { PlayerPosition } from '../../../../types';
import { TranslateService } from '@ngx-translate/core';

interface Position {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'ysg-player-detail',
  templateUrl: 'player-detail.component.html',
  styleUrls: []
})
export class PlayerDetailComponent {
  crudDetailOptions: CrudDetailOptions;

  positions: Position[] = [
    {
      value: PlayerPosition.SKATER,
      viewValue: this.translateService.instant('PLAYER_POSITION_SKATER')
    },
    {
      value: PlayerPosition.GOALTENDER,
      viewValue: this.translateService.instant('PLAYER_POSITION_GOALTENDER')
    }
  ];

  constructor(
    private playersService: PlayersService,
    private formBuilder: UntypedFormBuilder,
    private translateService: TranslateService
  ) {
    this.crudDetailOptions = {
      form: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        shirtNumber: ['', Validators.required],
        position: [PlayerPosition.SKATER, Validators.required],
        _links: ['']
      }),
      crudService: playersService,
      routerListUrl: '/masterdata/players'
    };
  }
}
