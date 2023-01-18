import { PlayerDetailComponent } from './player-detail.component';
import { PlayersService } from '../../../../core/services/players.service';
import { fakeAsync } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

describe('PlayerDetailComponent', () => {
  let component: PlayerDetailComponent;
  let playerService: PlayersService;
  let formBuilder: FormBuilder;
  let translateService: TranslateService;

  beforeEach(() => {
    playerService = <any>{};
    formBuilder = new FormBuilder();
    translateService = <any>{
      instant: jest.fn().mockImplementation((translationKey) => translationKey)
    };

    component = new PlayerDetailComponent(
      playerService,
      formBuilder,
      translateService
    );
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('initializes the positions array', () => {
      expect(component.positions.length).toBe(2);
      expect(component.positions[0].viewValue).toBe('PLAYER_POSITION_SKATER');
      expect(component.positions[1].viewValue).toBe(
        'PLAYER_POSITION_GOALTENDER'
      );
      expect(translateService.instant).toHaveBeenCalledTimes(2);
    });

    it('creates the options', fakeAsync(() => {
      expect(component.crudDetailOptions.form).not.toBeNull();
      expect(component.crudDetailOptions.crudService).toBe(playerService);
      expect(component.crudDetailOptions.routerListUrl).toBe('/players');
    }));
  });
});
