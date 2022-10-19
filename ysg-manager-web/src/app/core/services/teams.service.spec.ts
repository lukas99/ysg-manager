import { TestBed } from '@angular/core/testing';
import { TeamsService } from './teams.service';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { Team, TeamList, Tournament, TournamentList } from '../../types';
import { TournamentsService } from './tournaments.service';
import DoneCallback = jest.DoneCallback;
import { CacheService } from './cache.service';

describe('TeamsService', () => {
  let service: TeamsService;
  let tournamentService: TournamentsService;
  let httpMock: HttpTestingController;
  let cacheService: CacheService;

  let tournament: Tournament = {
    name: 'YSG 2019',
    dateDescription: '2019',
    active: false,
    _links: {
      self: { href: 'tournaments/1' },
      teams: { href: 'tournaments/1/teams' },
      skills: { href: 'tournaments/1/skills' },
      calculateskillrankings: {
        href: 'tournaments/1/skills/calculate-rankings'
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
    service = TestBed.inject(TeamsService);
    tournamentService = TestBed.inject(TournamentsService);
    httpMock = TestBed.inject(HttpTestingController);
    cacheService = TestBed.inject(CacheService);

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

  describe('getTeams', () => {
    let teams: Team[];

    beforeEach(() => {
      teams = [<Team>{ name: 'EHC Engelberg' }, <Team>{ name: 'SC Bern' }];
      localStorage.removeItem('ysg-teams');
    });

    afterEach(() => {
      localStorage.removeItem('ysg-teams');
    });

    it('should get the teams of a tournament  and store them to cache', (done: DoneCallback) => {
      service.getTeams().subscribe((result) => {
        expect(result).toHaveLength(2);
        expect(result).toEqual(teams);
        done();
      });

      const testRequest = httpMock.expectOne('tournaments/1/teams');
      expect(testRequest.request.method).toBe('GET');
      testRequest.flush(<TeamList>{
        _embedded: {
          teamModelList: teams
        }
      });

      expect(cacheService.getCache('ysg-teams')).toMatchObject([
        { name: 'EHC Engelberg', isCached: true },
        { name: 'SC Bern', isCached: true }
      ]);
    });

    it('should return an empty list when no teams are available', (done: DoneCallback) => {
      service.getTeams().subscribe((result) => {
        expect(result).toHaveLength(0);
        done();
      });

      const testRequest = httpMock.expectOne('tournaments/1/teams');
      expect(testRequest.request.method).toBe('GET');
      testRequest.flush(<TeamList>{});
    });

    it('loads the cached tournaments when loading failed', (done: DoneCallback) => {
      cacheService.replaceCache(teams, 'ysg-teams');

      service.getTeams().subscribe((result) => {
        expect(result).toHaveLength(2);
        expect(result).toMatchObject([
          { name: 'EHC Engelberg', isCached: true },
          { name: 'SC Bern', isCached: true }
        ]);
        done();
      });

      const testRequest = httpMock.expectOne('tournaments/1/teams');
      expect(testRequest.request.method).toBe('GET');
      testRequest.flush('', { status: 504, statusText: 'Timeout' });
    });
  });

  it('should create a new team', (done: DoneCallback) => {
    let team = <Team>{
      name: 'EHC Engelberg'
    };
    let createdTeam = <Team>{
      name: 'EHC Engelberg created',
      _links: { self: { href: 'teams/1' } }
    };

    service.createTeam(team).subscribe((result) => {
      expect(result).toBe(createdTeam);
      done();
    });

    const testRequest = httpMock.expectOne('tournaments/1/teams');
    expect(testRequest.request.method).toBe('POST');
    testRequest.flush(createdTeam);
  });

  it('should update a given team', (done: DoneCallback) => {
    let team = <Team>{
      name: 'EHC Engelberg',
      _links: { self: { href: 'teams/1' } }
    };
    let updatedTeam = <Team>{
      name: 'SC Engelberg',
      _links: { self: { href: 'teams/1' } }
    };

    service.updateTeam(team).subscribe((result) => {
      expect(result).toBe(updatedTeam);
      done();
    });

    const testRequest = httpMock.expectOne(team._links.self.href);
    expect(testRequest.request.method).toBe('PUT');
    testRequest.flush(updatedTeam);
  });

  it('should delete a given team', (done: DoneCallback) => {
    let team = <Team>{
      name: 'EHC Engelberg',
      _links: { self: { href: 'teams/1' } }
    };
    let deletedTeam = <Team>{
      name: 'EHC Engelberg deleted',
      _links: { self: { href: 'teams/1' } }
    };

    service.deleteTeam(team).subscribe((result) => {
      expect(result).toBe(deletedTeam);
      done();
    });

    const testRequest = httpMock.expectOne(team._links.self.href);
    expect(testRequest.request.method).toBe('DELETE');
    testRequest.flush(deletedTeam);
  });

  it('should get a teams title', () => {
    let team = <Team>{
      name: 'EHC Engelberg'
    };

    const title = service.getTeamTitle(team);

    expect(title).toBe('EHC Engelberg');
  });
});
