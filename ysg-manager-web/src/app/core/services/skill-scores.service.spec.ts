import { Link, Player, Skill, SkillResult, Team } from '../../types';
import { STORAGE_KEY as SKILL_RESULTS_STORAGE_KEY } from './skill-results.service';
import * as uuid from 'uuid';
import { Observable, of, throwError } from 'rxjs';
import { SkillScoresService } from './skill-scores.service';
import { CacheService } from './cache.service';

jest.mock('uuid');

describe('SkillScoresService', () => {
  let service: SkillScoresService<SkillResult>;

  beforeEach(() => {
    const uuidSpy = jest.spyOn(uuid, 'v4');
    // do not use multiple mockReturnValueOnce because it's not reinitialized for each test
    uuidSpy.mockReturnValue('1111');

    service = new SkillScoresService<SkillResult>(
      new CacheService<SkillResult>()
    );

    localStorage.removeItem(SKILL_RESULTS_STORAGE_KEY);
  });

  afterEach(() => {
    localStorage.removeItem(SKILL_RESULTS_STORAGE_KEY);
  });

  describe('cache operations', () => {
    let skill1Link: Link;
    let skill2Link: Link;

    let team1Link: Link;
    let team2Link: Link;

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
      resultSkill2Team1Link = { href: '/skill-results/21' };
      resultSkill2Team2Link = { href: '/skill-results/22' };
      team1Link = { href: '/teams/1' };
      team2Link = { href: '/teams/2' };
      skill1 = <Skill>{
        _links: { self: skill1Link }
      };
      skill2 = <Skill>{
        _links: { self: skill2Link }
      };
      team1 = <Team>{
        _links: { self: team1Link }
      };
      team2 = <Team>{
        _links: { self: team2Link }
      };

      // skills to create (no self link)
      resultSkill1Team1 = <SkillResult>{
        player: {
          shirtNumber: 10,
          team: { _links: { self: team1Link } } as Team
        } as Player,
        _links: {
          skill: skill1Link
        }
      };
      resultSkill1Team2 = <SkillResult>{
        player: {
          shirtNumber: 20,
          team: { _links: { self: team2Link } } as Team
        } as Player,
        _links: {
          skill: skill1Link
        }
      };
      // skills to update (with self link)
      resultSkill2Team1 = <SkillResult>{
        player: {
          shirtNumber: 30,
          team: { _links: { self: team1Link } } as Team
        } as Player,
        _links: {
          self: resultSkill2Team1Link,
          skill: skill2Link
        }
      };
      resultSkill2Team2 = <SkillResult>{
        player: {
          shirtNumber: 40,
          team: { _links: { self: team2Link } } as Team
        } as Player,
        _links: {
          self: resultSkill2Team2Link,
          skill: skill2Link
        }
      };

      createdResultSkill1Team1 = JSON.parse(JSON.stringify(resultSkill1Team1));
      createdResultSkill1Team2 = JSON.parse(JSON.stringify(resultSkill1Team2));
      createdResultSkill1Team1._links.self = { href: '/skill-results/11' }; //resultSkill1Team1Link;
      createdResultSkill1Team2._links.self = { href: '/skill-results/12' }; //resultSkill1Team2Link;

      service.addToCache(resultSkill1Team1, SKILL_RESULTS_STORAGE_KEY);
      service.addToCache(resultSkill1Team2, SKILL_RESULTS_STORAGE_KEY);
      service.addToCache(resultSkill2Team1, SKILL_RESULTS_STORAGE_KEY);
      service.addToCache(resultSkill2Team2, SKILL_RESULTS_STORAGE_KEY);
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
      service.addToCache(
        anotherSkillResultForSkill1Team1,
        SKILL_RESULTS_STORAGE_KEY
      );

      expect(
        service.getCachedSkillScore(
          skill1,
          team1,
          anotherSkillResultForSkill1Team1.player,
          SKILL_RESULTS_STORAGE_KEY
        )
      ).toEqual({
        ...anotherSkillResultForSkill1Team1,
        isCached: true,
        cacheId: '1111'
      });
    });

    describe('pushCachedSkillResultsToServer', () => {
      let skillResultService: any;
      let updateSkillResult: (result: SkillResult) => Observable<SkillResult>;
      let createSkillResult: (
        result: SkillResult,
        skill: Skill
      ) => Observable<SkillResult>;
      let updateSkillResultSpy: any;
      let createSkillResultSpy: any;

      beforeEach(() => {
        updateSkillResult = (result: SkillResult) => of(result);
        createSkillResult = (result: SkillResult, skill: Skill) => of(result);
        skillResultService = {
          updateSkillResult: updateSkillResult,
          createSkillResult: createSkillResult
        };
        updateSkillResultSpy = jest.spyOn(
          skillResultService,
          'updateSkillResult'
        );
        createSkillResultSpy = jest.spyOn(
          skillResultService,
          'createSkillResult'
        );
      });

      it('should send cached results of all skills to the server', () => {
        createSkillResultSpy.mockReturnValueOnce(of(createdResultSkill1Team1));
        createSkillResultSpy.mockReturnValueOnce(of(createdResultSkill1Team2));

        verifyCache(
          resultSkill1Team1,
          resultSkill1Team2,
          resultSkill2Team1,
          resultSkill2Team2
        );

        service.pushCachedSkillScoresToServer(
          of([skill1, skill2]),
          SKILL_RESULTS_STORAGE_KEY,
          skillResultService.updateSkillResult,
          skillResultService.createSkillResult
        );

        expect(createSkillResultSpy).toHaveBeenCalledTimes(2);
        expect(updateSkillResultSpy).toHaveBeenCalledTimes(2);

        expect(createSkillResultSpy).toHaveBeenNthCalledWith(
          1,
          { ...resultSkill1Team1, isCached: true, cacheId: '1111' },
          skill1
        );
        expect(createSkillResultSpy).toHaveBeenNthCalledWith(
          2,
          { ...resultSkill1Team2, isCached: true, cacheId: '1111' },
          skill1
        );

        expect(updateSkillResultSpy).toHaveBeenNthCalledWith(1, {
          ...resultSkill2Team1,
          isCached: true,
          cacheId: '1111'
        });
        expect(updateSkillResultSpy).toHaveBeenNthCalledWith(2, {
          ...resultSkill2Team2,
          isCached: true,
          cacheId: '1111'
        });

        // hint: cacheIDs would be recreated because cache is replaced
        verifyCache(
          createdResultSkill1Team1,
          createdResultSkill1Team2,
          resultSkill2Team1,
          resultSkill2Team2
        );
      });

      it('should use the existing results in case server is not available', () => {
        createSkillResultSpy.mockReturnValue(
          throwError(() => new Error('Internal Server Error'))
        );

        verifyCache(
          resultSkill1Team1,
          resultSkill1Team2,
          resultSkill2Team1,
          resultSkill2Team2
        );

        service.pushCachedSkillScoresToServer(
          of([skill1, skill2]),
          SKILL_RESULTS_STORAGE_KEY,
          skillResultService.updateSkillResult,
          skillResultService.createSkillResult
        );

        expect(createSkillResultSpy).toHaveBeenCalledTimes(2);
        expect(updateSkillResultSpy).toHaveBeenCalledTimes(2);

        expect(createSkillResultSpy).toHaveBeenNthCalledWith(
          1,
          { ...resultSkill1Team1, isCached: true, cacheId: '1111' },
          skill1
        );
        expect(createSkillResultSpy).toHaveBeenNthCalledWith(
          2,
          { ...resultSkill1Team2, isCached: true, cacheId: '1111' },
          skill1
        );

        expect(updateSkillResultSpy).toHaveBeenNthCalledWith(1, {
          ...resultSkill2Team1,
          isCached: true,
          cacheId: '1111'
        });
        expect(updateSkillResultSpy).toHaveBeenNthCalledWith(2, {
          ...resultSkill2Team2,
          isCached: true,
          cacheId: '1111'
        });

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
      expect(
        service.getCachedSkillScores(skill1, team1, SKILL_RESULTS_STORAGE_KEY)
      ).toEqual([{ ...result1, isCached: true, cacheId: '1111' }]);
      expect(
        service.getCachedSkillScores(skill1, team2, SKILL_RESULTS_STORAGE_KEY)
      ).toEqual([{ ...result2, isCached: true, cacheId: '1111' }]);
      expect(
        service.getCachedSkillScores(skill2, team1, SKILL_RESULTS_STORAGE_KEY)
      ).toEqual([{ ...result3, isCached: true, cacheId: '1111' }]);
      expect(
        service.getCachedSkillScores(skill2, team2, SKILL_RESULTS_STORAGE_KEY)
      ).toEqual([{ ...result4, isCached: true, cacheId: '1111' }]);
    }
  });
});
