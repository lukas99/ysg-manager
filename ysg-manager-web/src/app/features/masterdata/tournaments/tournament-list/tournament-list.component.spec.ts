import { TournamentListComponent } from './tournament-list.component';
import { TournamentsService } from '../../../../core/services/tournaments.service';
import { TranslateService } from '@ngx-translate/core';

describe('TournamentListComponent', () => {
  let component: TournamentListComponent;

  let tournamentsService: TournamentsService;
  let translateService: TranslateService;

  beforeEach(() => {
    tournamentsService = <TournamentsService>{};
    translateService = <any>{
      instant: jest.fn().mockImplementation((translationKey) => translationKey)
    };
    component = new TournamentListComponent(
      tournamentsService,
      translateService
    );
  });

  it('can be created', () => {
    const options = component.crudListOptions;

    expect(options.columnDefs.length).toBe(2);
    expect(translateService.instant).toHaveBeenCalled();

    expect(options.crudService).toBe(tournamentsService);
    expect(options.routerDetailUrl).toBeDefined();
  });
});
