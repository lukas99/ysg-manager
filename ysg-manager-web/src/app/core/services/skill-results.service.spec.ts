import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import {
  Player,
  PlayerList,
  Skill,
  SkillResult,
  SkillResultList,
  SkillType
} from '../../types';
import { SkillResultsService } from './skill-results.service';
import { SkillsService } from './skills.service';
import DoneCallback = jest.DoneCallback;

describe('SkillResultsService', () => {
  let service: SkillResultsService;
  let skillsService: SkillsService;
  let httpMock: HttpTestingController;

  let skill: Skill = {
    name: 'Best Shot',
    skillType: SkillType.POINTS,
    number: 1,
    _links: {
      self: { href: 'skills/1' },
      tournament: { href: 'tournaments/1' },
      skillresults: { href: '/skills/1/skill-results' }
    }
  };

  beforeEach(() => {
    skillsService = <any>{
      getSelectedItemValue: jest.fn(() => skill)
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: SkillsService, useValue: skillsService }]
    });
    service = TestBed.inject(SkillResultsService);
    skillsService = TestBed.inject(SkillsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
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
});