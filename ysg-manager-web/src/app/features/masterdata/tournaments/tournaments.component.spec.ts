import { TournamentsComponent } from './tournaments.component';
import { TournamentsService } from '../../../core/services/tournaments.service';
import { Tournament } from '../../../types';
import { of } from 'rxjs';

describe('TournamentsComponent', () => {
  let tournamentService: TournamentsService;
  let component: TournamentsComponent;

  beforeEach(() => {
    tournamentService = <any>{ getTournaments: jest.fn() };
    component = new TournamentsComponent(tournamentService);
  });

  describe('ngOnInit', () => {
    it('loads the tournaments', () => {
      const tournaments = [
        <Tournament>{ name: 'YSG 2019', dateDescription: '2019' },
        <Tournament>{ name: 'YSG 2020', dateDescription: '2020' }
      ];
      tournamentService.getTournaments = () => of(tournaments);

      component.ngOnInit();

      expect(component.tournaments).toBe(tournaments);
    });
  });
});
