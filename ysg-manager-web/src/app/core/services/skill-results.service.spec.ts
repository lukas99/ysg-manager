import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import {
  Link,
  Player,
  PlayerList,
  PlayerPosition,
  Skill,
  SkillResult,
  SkillResultList,
  SkillType,
  Team
} from '../../types';
import {
  SkillResultsService,
  STORAGE_KEY as SKILL_RESULTS_STORAGE_KEY
} from './skill-results.service';
import { SkillsService } from './skills.service';
import * as uuid from 'uuid';
import { of } from 'rxjs';
import DoneCallback = jest.DoneCallback;

jest.mock('uuid');

describe('SkillResultsService', () => {
  let service: SkillResultsService;
  let skillsService: SkillsService;
  let httpMock: HttpTestingController;

  let skill: Skill = {
    name: 'Best Shot',
    typeForPlayers: SkillType.POINTS,
    typeForGoaltenders: SkillType.POINTS,
    tournamentRankingPlayerPosition: PlayerPosition.SKATER,
    number: 1,
    _links: {
      self: { href: 'skills/1' },
      tournament: { href: 'tournaments/1' },
      skillresults: { href: '/skills/1/skill-results' },
      skillratings: { href: '/skills/1/skill-ratings' }
    }
  };

  beforeEach(() => {
    const uuidSpy = jest.spyOn(uuid, 'v4');
    // do not use multiple mockReturnValueOnce because it's not reinitialized for each test
    uuidSpy.mockReturnValue('1111');

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
    httpMock = TestBed.inject(HttpTestingController);

    localStorage.removeItem(SKILL_RESULTS_STORAGE_KEY);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.removeItem(SKILL_RESULTS_STORAGE_KEY);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
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

  describe('cache operations', () => {
    let skill1Link: Link;
    let skill2Link: Link;

    let team1Link: Link;
    let team2Link: Link;

    let skill1ResultsLink: Link;
    let skill2ResultsLink: Link;

    let resultSkill1Team1Link: Link;
    let resultSkill1Team2Link: Link;
    let resultSkill2Team1Link: Link;
    let resultSkill2Team2Link: Link;

    let skill1: Skill;
    let skill2: Skill;

    let team1: Team;
    let team2: Team;

    let resultSkill1Team1: SkillResult;
    let resultSkill1Team2: SkillResult;
    let resultSkill2Team1: SkillResult;
    let resultSkill2Team2: SkillResult;

    let createdResultSkill1Team1: SkillResult;
    let createdResultSkill1Team2: SkillResult;

    beforeEach(() => {
      skill1Link = { href: '/skills/1' };
      skill2Link = { href: '/skills/2' };
      skill1ResultsLink = { href: '/skills/1/skill-results' };
      skill2ResultsLink = { href: '/skills/2/skill-results' };
      resultSkill1Team1Link = { href: '/skill-results/11' };
      resultSkill1Team2Link = { href: '/skill-results/12' };
      resultSkill2Team1Link = { href: '/skill-results/21' };
      resultSkill2Team2Link = { href: '/skill-results/22' };
      team1Link = { href: '/teams/1' };
      team2Link = { href: '/teams/2' };
      skill1 = <Skill>{
        _links: { self: skill1Link, skillresults: skill1ResultsLink }
      };
      skill2 = <Skill>{
        _links: { self: skill2Link, skillresults: skill2ResultsLink }
      };
      team1 = <Team>{ _links: { self: team1Link } };
      team2 = <Team>{ _links: { self: team2Link } };

      // skills to create (no self link)
      resultSkill1Team1 = <SkillResult>{
        player: {
          shirtNumber: 10,
          team: { _links: { self: team1Link } } as Team
        } as Player,
        _links: { skill: skill1Link }
      };
      resultSkill1Team2 = <SkillResult>{
        player: {
          shirtNumber: 20,
          team: { _links: { self: team2Link } } as Team
        } as Player,
        _links: { skill: skill1Link }
      };
      // skills to update (with self link)
      resultSkill2Team1 = <SkillResult>{
        player: {
          shirtNumber: 30,
          team: { _links: { self: team1Link } } as Team
        } as Player,
        _links: { self: resultSkill2Team1Link, skill: skill2Link }
      };
      resultSkill2Team2 = <SkillResult>{
        player: {
          shirtNumber: 40,
          team: { _links: { self: team2Link } } as Team
        } as Player,
        _links: { self: resultSkill2Team2Link, skill: skill2Link }
      };

      createdResultSkill1Team1 = JSON.parse(JSON.stringify(resultSkill1Team1));
      createdResultSkill1Team2 = JSON.parse(JSON.stringify(resultSkill1Team2));
      createdResultSkill1Team1._links.self = resultSkill1Team1Link;
      createdResultSkill1Team2._links.self = resultSkill1Team2Link;

      skillsService.getSkills = jest.fn(() => of([skill1, skill2]));

      service.addSkillResultToCache(resultSkill1Team1);
      service.addSkillResultToCache(resultSkill1Team2);
      service.addSkillResultToCache(resultSkill2Team1);
      service.addSkillResultToCache(resultSkill2Team2);
    });

    it('should return cached skill results', () => {
      verifyCache(
        resultSkill1Team1,
        resultSkill1Team2,
        resultSkill2Team1,
        resultSkill2Team2
      );
    });

    it('should return cached single skill result', () => {
      let anotherSkillResultForSkill1Team1 = <SkillResult>{
        player: {
          shirtNumber: 20,
          team: { _links: { self: team1Link } } as Team
        } as Player,
        _links: { skill: skill1Link }
      };
      service.addSkillResultToCache(anotherSkillResultForSkill1Team1);

      expect(
        service.getCachedSkillResult(
          skill1,
          team1,
          anotherSkillResultForSkill1Team1.player
        )
      ).toEqual({
        ...anotherSkillResultForSkill1Team1,
        isCached: true,
        cacheId: '1111'
      });
    });

    describe('pushCachedSkillResultsToServer', () => {
      it('should send cached results of all skills to the server', () => {
        verifyCache(
          resultSkill1Team1,
          resultSkill1Team2,
          resultSkill2Team1,
          resultSkill2Team2
        );

        service.pushCachedSkillResultsToServer();

        const createRequests = httpMock.match(skill1ResultsLink.href);
        expect(createRequests.length).toBe(2);
        const createRequest1 = createRequests[0];
        const createRequest2 = createRequests[1];
        expect(createRequest1.request.method).toBe('POST');
        expect(createRequest2.request.method).toBe('POST');
        createRequest1.flush(createdResultSkill1Team1);
        createRequest2.flush(createdResultSkill1Team2);

        const updateRequest1 = httpMock.expectOne(resultSkill2Team1Link.href);
        updateRequest1.flush(resultSkill2Team1);
        const updateRequest2 = httpMock.expectOne(resultSkill2Team2Link.href);
        updateRequest2.flush(resultSkill2Team2);

        // hint: cacheIDs would be recreated because cache is replaced
        verifyCache(
          createdResultSkill1Team1,
          createdResultSkill1Team2,
          resultSkill2Team1,
          resultSkill2Team2
        );
      });

      it('should use the existing results in case server is not available', () => {
        verifyCache(
          resultSkill1Team1,
          resultSkill1Team2,
          resultSkill2Team1,
          resultSkill2Team2
        );

        service.pushCachedSkillResultsToServer();

        const requests = httpMock.match(skill1ResultsLink.href);
        requests[0].flush('data', {
          status: 500,
          statusText: 'Internal Server Error'
        });
        requests[1].flush('data', {
          status: 500,
          statusText: 'Internal Server Error'
        });
        httpMock
          .expectOne(resultSkill2Team1Link.href)
          .flush('data', { status: 500, statusText: 'Internal Server Error' });
        httpMock
          .expectOne(resultSkill2Team2Link.href)
          .flush('data', { status: 500, statusText: 'Internal Server Error' });

        // hint: cacheIDs would be recreated because cache is replaced
        verifyCache(
          resultSkill1Team1,
          resultSkill1Team2,
          resultSkill2Team1,
          resultSkill2Team2
        );
      });
    });

    function verifyCache(
      result1: SkillResult,
      result2: SkillResult,
      result3: SkillResult,
      result4: SkillResult
    ) {
      expect(service.getCachedSkillResults(skill1, team1)).toEqual([
        { ...result1, isCached: true, cacheId: '1111' }
      ]);
      expect(service.getCachedSkillResults(skill1, team2)).toEqual([
        { ...result2, isCached: true, cacheId: '1111' }
      ]);
      expect(service.getCachedSkillResults(skill2, team1)).toEqual([
        { ...result3, isCached: true, cacheId: '1111' }
      ]);
      expect(service.getCachedSkillResults(skill2, team2)).toEqual([
        { ...result4, isCached: true, cacheId: '1111' }
      ]);
    }
  });
});
