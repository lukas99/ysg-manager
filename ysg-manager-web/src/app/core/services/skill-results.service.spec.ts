import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import {
  Player,
  PlayerList,
  PlayerPosition,
  Skill,
  SkillResult,
  SkillResultList,
  SkillType,
  Team,
  Tournament,
  TournamentList
} from '../../types';
import { SkillResultsService } from './skill-results.service';
import { SkillsService } from './skills.service';
import { TournamentsService } from './tournaments.service';
import DoneCallback = jest.DoneCallback;

describe('SkillResultsService', () => {
  let service: SkillResultsService;
  let skillsService: SkillsService;
  let tournamentService: TournamentsService;
  let httpMock: HttpTestingController;

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
      },
      team: { href: 'teams/:teamId' },
      skill: { href: 'skills/:skillId' },
      skillresult: { href: 'skill-results/:resultId' },
      skillrating: { href: 'skill-ratings/:ratingId' }
    }
  };

  let skill: Skill = {
    id: 25,
    name: 'Best Shot',
    typeForPlayers: SkillType.POINTS,
    typeForGoaltenders: SkillType.POINTS,
    tournamentRankingPlayerPosition: PlayerPosition.SKATER,
    number: 1,
    _links: {
      self: { href: 'skills/1' },
      tournament: { href: 'tournaments/1' },
      skillresults: {
        href: '/skills/1/skill-results'
      },
      skillResultsByTeam: {
        href: '/skills/1/skill-results?teamId=:teamId'
      },
      skillResultsByTeamAndPlayerShirtNumber: {
        href: '/skills/1/skill-results?teamId=:teamId&playerShirtNumber=:playerShirtNumber'
      },
      skillratings: {
        href: '/skills/1/skill-ratings'
      },
      skillRatingsByTeam: {
        href: '/skills/1/skill-ratings?teamId=:teamId'
      },
      skillRatingsByTeamAndPlayerShirtNumber: {
        href: '/skills/1/skill-ratings?teamId=:teamId&playerShirtNumber=:playerShirtNumber'
      }
    }
  };

  let team: Team = {
    id: 26,
    name: 'EHC Engelberg',
    _links: {
      self: { href: 'teams/1' },
      players: { href: 'teams/1/players' }
    }
  };

  beforeEach(() => {
    skillsService = <any>{
      getSkills: jest.fn(),
      getSelectedItemValue: jest.fn(() => skill)
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: SkillsService, useValue: skillsService }]
    });
    service = TestBed.inject(SkillResultsService);
    skillsService = TestBed.inject(SkillsService);
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

  it('should get a skill result', (done) => {
    const skillResult = <SkillResult>{ id: 2, points: 5 };

    service.getSkillResult(2).subscribe((result) => {
      expect(result).toBe(skillResult);
      done();
    });

    const testRequest = httpMock.expectOne('skill-results/2');
    expect(testRequest.request.method).toBe('GET');
    testRequest.flush(skillResult);
  });

  describe('getSkillResults', () => {
    it('should get the skillResults of a skill', (done: DoneCallback) => {
      const skillResults = [
        <SkillResult>{ points: 5 },
        <SkillResult>{ points: 6 }
      ];

      service.getSkillResults(skill).subscribe((result) => {
        expect(result).toHaveLength(2);
        expect(result).toEqual(skillResults);
        done();
      });

      const testRequest = httpMock.expectOne('/skills/1/skill-results');
      expect(testRequest.request.method).toBe('GET');
      testRequest.flush(<SkillResultList>{
        _embedded: {
          skillResultModelList: skillResults
        }
      });
    });

    it('should return an empty list when no results are available', (done: DoneCallback) => {
      service.getSkillResults(skill).subscribe((result) => {
        expect(result).toHaveLength(0);
        done();
      });

      const testRequest = httpMock.expectOne('/skills/1/skill-results');
      expect(testRequest.request.method).toBe('GET');
      testRequest.flush(<PlayerList>{});
    });
  });

  describe('getSkillResultsBySkillAndTeam', () => {
    it('should get the skillResults of a skill filtered by team', (done: DoneCallback) => {
      const skillResults = [
        <SkillResult>{ points: 5 },
        <SkillResult>{ points: 6 }
      ];

      service.getSkillResultsBySkillAndTeam(skill, team).subscribe((result) => {
        expect(result).toHaveLength(2);
        expect(result).toEqual(skillResults);
        done();
      });

      const testRequest = httpMock.expectOne(
        '/skills/1/skill-results?teamId=26'
      );
      expect(testRequest.request.method).toBe('GET');
      testRequest.flush(<SkillResultList>{
        _embedded: {
          skillResultModelList: skillResults
        }
      });
    });

    it('should return an empty list when no results are available', (done: DoneCallback) => {
      service.getSkillResultsBySkillAndTeam(skill, team).subscribe((result) => {
        expect(result).toHaveLength(0);
        done();
      });

      const testRequest = httpMock.expectOne(
        '/skills/1/skill-results?teamId=26'
      );
      expect(testRequest.request.method).toBe('GET');
      testRequest.flush(<PlayerList>{});
    });
  });

  describe('getSkillResultsBySkillAndTeamAndPlayerShirtNumber', () => {
    it('should get the skillResults of a skill filtered by team and shirt number', (done: DoneCallback) => {
      const skillResults = [
        <SkillResult>{ points: 5 },
        <SkillResult>{ points: 6 }
      ];

      service
        .getSkillResultsBySkillAndTeamAndPlayerShirtNumber(skill, team, 99)
        .subscribe((result) => {
          expect(result).toHaveLength(2);
          expect(result).toEqual(skillResults);
          done();
        });

      const testRequest = httpMock.expectOne(
        '/skills/1/skill-results?teamId=26&playerShirtNumber=99'
      );
      expect(testRequest.request.method).toBe('GET');
      testRequest.flush(<SkillResultList>{
        _embedded: {
          skillResultModelList: skillResults
        }
      });
    });

    it('should return an empty list when no results are available', (done: DoneCallback) => {
      service
        .getSkillResultsBySkillAndTeamAndPlayerShirtNumber(skill, team, 99)
        .subscribe((result) => {
          expect(result).toHaveLength(0);
          done();
        });

      const testRequest = httpMock.expectOne(
        '/skills/1/skill-results?teamId=26&playerShirtNumber=99'
      );
      expect(testRequest.request.method).toBe('GET');
      testRequest.flush(<PlayerList>{});
    });
  });

  it('should create a new skill result', (done: DoneCallback) => {
    let skillResult = <SkillResult>{ points: 5 };
    let skill = <Skill>{
      name: 'Best Shot',
      _links: { skillresults: { href: '/skills/1/skill-results' } }
    };

    service.createSkillResult(skillResult, skill).subscribe((result) => {
      expect(result).toBe(skillResult);
      done();
    });

    const testRequest = httpMock.expectOne('/skills/1/skill-results');
    expect(testRequest.request.method).toBe('POST');
    testRequest.flush(skillResult);
  });

  it('should update a given skill result', (done: DoneCallback) => {
    let skillResult = <SkillResult>{
      points: 5,
      _links: { self: { href: '/skills/1/skill-results/1' } }
    };
    let updatedSkillResult = <SkillResult>{
      points: 6,
      _links: { self: { href: '/skills/1/skill-results/1' } }
    };

    service.updateSkillResult(skillResult).subscribe((result) => {
      expect(result).toBe(updatedSkillResult);
      done();
    });

    const testRequest = httpMock.expectOne(skillResult._links.self.href);
    expect(testRequest.request.method).toBe('PUT');
    testRequest.flush(updatedSkillResult);
  });

  it('should delete a given skill result', (done: DoneCallback) => {
    let skillResult = <SkillResult>{
      points: 5,
      _links: { self: { href: '/skills/1/skill-results/1' } }
    };
    let deletedSkillResult = <SkillResult>{
      points: 6,
      _links: { self: { href: '/skills/1/skill-results/1' } }
    };

    service.deleteSkillResult(skillResult).subscribe((result) => {
      expect(result).toBe(deletedSkillResult);
      done();
    });

    const testRequest = httpMock.expectOne(skillResult._links.self.href);
    expect(testRequest.request.method).toBe('DELETE');
    testRequest.flush(deletedSkillResult);
  });

  describe('getSkillResultTitle', () => {
    it('should get the title of a new skill result', () => {
      let skillResult = <SkillResult>{
        _links: { self: { href: '/skills/1/skill-results/1' } }
      };

      const title = service.getSkillResultTitle(skillResult);

      expect(title).toBe('Best Shot');
    });

    it('should get the title of an existing skill result', () => {
      let player = <Player>{
        firstName: 'Sven',
        lastName: 'Meier'
      };
      let skillResult = <SkillResult>{
        points: 5,
        player: player,
        _links: { self: { href: '/skills/1/skill-results/1' } }
      };

      const title = service.getSkillResultTitle(skillResult);

      expect(title).toBe('Sven Meier (Best Shot)');
    });
  });
});
