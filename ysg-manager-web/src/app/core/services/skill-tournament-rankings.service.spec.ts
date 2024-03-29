import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import {
  SkillList,
  SkillTournamentRanking,
  SkillTournamentRankingList,
  Tournament,
  TournamentList
} from '../../types';
import { TournamentsService } from './tournaments.service';
import { SkillTournamentRankingsService } from './skill-tournament-rankings.service';
import DoneCallback = jest.DoneCallback;

describe('SkillTournamentRankingsService', () => {
  let service: SkillTournamentRankingsService;
  let tournamentService: TournamentsService;
  let httpMock: HttpTestingController;

  let tournament: Tournament = {
    name: 'YSG 2019',
    dateDescription: '2019',
    active: false,
    _links: {
      self: { href: 'tournaments/1' },
      teams: { href: 'tournaments/1/teams' },
      skills: { href: 'tournaments/1/skillRankings' },
      calculateskillrankings: {
        href: 'tournaments/1/skillRankings/calculate-rankings'
      },
      skillrankings: { href: 'tournaments/1/skill-rankings' },
      skilltournamentrankings: {
        href: 'tournaments/1/skill-tournament-rankings'
      },
      team: { href: 'teams/:teamId' },
      skill: { href: 'skills/:skillId' },
      skillresult: { href: 'skill-results/:resultId' },
      skillrating: { href: 'skill-ratings/:ratingId' }
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TournamentsService]
    });
    service = TestBed.inject(SkillTournamentRankingsService);
    tournamentService = TestBed.inject(TournamentsService);
    httpMock = TestBed.inject(HttpTestingController);

    const getDefaultTournament = httpMock.expectOne(
      tournamentService['tournamentsUrl']
    );
    expect(getDefaultTournament.request.method).toBe('GET');
    getDefaultTournament.flush(<TournamentList>{
      _embedded: {
        tournamentModelList: [tournament]
      }
    });
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getSkillTournamentRankings', () => {
    it('should get the tournament rankings of a tournament', (done: DoneCallback) => {
      const skillTournamentRankings = [
        <SkillTournamentRanking>{ sequence: 1 },
        <SkillTournamentRanking>{ sequence: 2 }
      ];

      service
        .getSkillTournamentRankings()
        .subscribe((ranking: SkillTournamentRanking[]) => {
          expect(ranking).toHaveLength(2);
          expect(ranking).toEqual(skillTournamentRankings);
          done();
        });

      const testRequest = httpMock.expectOne(
        'tournaments/1/skill-tournament-rankings'
      );
      expect(testRequest.request.method).toBe('GET');
      testRequest.flush(<SkillTournamentRankingList>{
        _embedded: {
          skillTournamentRankingModelList: skillTournamentRankings
        }
      });
    });

    it('should return an empty list when no tournament rankings are available', (done: DoneCallback) => {
      service
        .getSkillTournamentRankings()
        .subscribe((result: SkillTournamentRanking[]) => {
          expect(result).toHaveLength(0);
          done();
        });

      const testRequest = httpMock.expectOne(
        'tournaments/1/skill-tournament-rankings'
      );
      expect(testRequest.request.method).toBe('GET');
      testRequest.flush(<SkillList>{});
    });
  });
});
