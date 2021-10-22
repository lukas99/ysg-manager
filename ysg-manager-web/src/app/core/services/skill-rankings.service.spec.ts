import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import {
  SkillList,
  SkillRanking,
  SkillRankingList,
  Tournament,
  TournamentList
} from '../../types';
import { TournamentsService } from './tournaments.service';
import { SkillRankingsService } from './skill-rankings.service';
import DoneCallback = jest.DoneCallback;

describe('SkillRankingsService', () => {
  let service: SkillRankingsService;
  let tournamentSerivce: TournamentsService;
  let httpMock: HttpTestingController;

  let tournament: Tournament = {
    name: 'YSG 2019',
    dateDescription: '2019',
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
      }
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TournamentsService]
    });
    service = TestBed.inject(SkillRankingsService);
    tournamentSerivce = TestBed.inject(TournamentsService);
    httpMock = TestBed.inject(HttpTestingController);

    const getDefaultTournament = httpMock.expectOne(
      tournamentSerivce['tournamentsUrl']
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

  describe('getSkillRankings', () => {
    it('should get the skill rankings of a tournament', (done: DoneCallback) => {
      const skillRankings = [
        <SkillRanking>{ sequence: 1 },
        <SkillRanking>{ sequence: 2 }
      ];

      service.getSkillRankings().subscribe((ranking: SkillRanking[]) => {
        expect(ranking).toHaveLength(2);
        expect(ranking).toEqual(skillRankings);
        done();
      });

      const testRequest = httpMock.expectOne('tournaments/1/skill-rankings');
      expect(testRequest.request.method).toBe('GET');
      testRequest.flush(<SkillRankingList>{
        _embedded: {
          skillRankingModelList: skillRankings
        }
      });
    });

    it('should return an empty list when no skill rankings are available', (done: DoneCallback) => {
      service.getSkillRankings().subscribe((result: SkillRanking[]) => {
        expect(result).toHaveLength(0);
        done();
      });

      const testRequest = httpMock.expectOne('tournaments/1/skill-rankings');
      expect(testRequest.request.method).toBe('GET');
      testRequest.flush(<SkillList>{});
    });
  });
});
