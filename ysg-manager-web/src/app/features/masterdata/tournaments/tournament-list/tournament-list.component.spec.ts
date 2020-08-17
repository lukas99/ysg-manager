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

    expect(options.headers.length).toBe(2);
    expect(options.headers[0].key).toBe('name');
    expect(options.headers[0].title).toBe('TOURNAMENT_NAME');
    expect(options.headers[1].key).toBe('dateDescription');
    expect(options.headers[1].title).toBe('TOURNAMENT_DATE_DESCRIPTION');
    expect(translateService.instant).toHaveBeenCalledTimes(2);

    expect(options.crudService).toBe(tournamentsService);
    expect(options.routerDetailUrl).toBeDefined();
  });
});
