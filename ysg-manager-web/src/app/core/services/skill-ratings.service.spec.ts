import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import {
  Player,
  PlayerList,
  Skill,
  SkillRating,
  SkillRatingList,
  SkillType
} from '../../types';
import { SkillRatingsService } from './skill-ratings.service';
import { SkillsService } from './skills.service';
import DoneCallback = jest.DoneCallback;

describe('SkillRatingsService', () => {
  let service: SkillRatingsService;
  let skillsService: SkillsService;
  let httpMock: HttpTestingController;

  let skill: Skill = {
    name: 'Best Shot',
    typeForPlayers: SkillType.POINTS,
    typeForGoaltenders: SkillType.POINTS,
    number: 1,
    _links: {
      self: { href: 'skills/1' },
      tournament: { href: 'tournaments/1' },
      skillresults: { href: '/skills/1/skill-results' },
      skillratings: { href: '/skills/1/skill-ratings' }
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
    service = TestBed.inject(SkillRatingsService);
    skillsService = TestBed.inject(SkillsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getSkillRatings', () => {
    it('should get the skillRatings of a skill', (done: DoneCallback) => {
      const skillRatings = [
        <SkillRating>{ score: 5 },
        <SkillRating>{ score: 6 }
      ];

      service.getSkillRatings(skill).subscribe((rating) => {
        expect(rating).toHaveLength(2);
        expect(rating).toEqual(skillRatings);
        done();
      });

      const testRequest = httpMock.expectOne('/skills/1/skill-ratings');
      expect(testRequest.request.method).toBe('GET');
      testRequest.flush(<SkillRatingList>{
        _embedded: {
          skillRatingModelList: skillRatings
        }
      });
    });

    it('should return an empty list when no ratings are available', (done: DoneCallback) => {
      service.getSkillRatings(skill).subscribe((rating) => {
        expect(rating).toHaveLength(0);
        done();
      });

      const testRequest = httpMock.expectOne('/skills/1/skill-ratings');
      expect(testRequest.request.method).toBe('GET');
      testRequest.flush(<PlayerList>{});
    });
  });

  it('should create a new skill rating', (done: DoneCallback) => {
    let skillRating = <SkillRating>{ score: 5 };
    let skill = <Skill>{
      name: 'Best Shot',
      _links: { skillratings: { href: '/skills/1/skill-ratings' } }
    };

    service.createSkillRating(skillRating, skill).subscribe((rating) => {
      expect(rating).toBe(skillRating);
      done();
    });

    const testRequest = httpMock.expectOne('/skills/1/skill-ratings');
    expect(testRequest.request.method).toBe('POST');
    testRequest.flush(skillRating);
  });

  it('should update a given skill rating', (done: DoneCallback) => {
    let skillRating = <SkillRating>{
      score: 5,
      _links: { self: { href: '/skills/1/skill-ratings/1' } }
    };
    let updatedSkillRating = <SkillRating>{
      score: 6,
      _links: { self: { href: '/skills/1/skill-ratings/1' } }
    };

    service.updateSkillRating(skillRating).subscribe((rating) => {
      expect(rating).toBe(updatedSkillRating);
      done();
    });

    const testRequest = httpMock.expectOne(skillRating._links.self.href);
    expect(testRequest.request.method).toBe('PUT');
    testRequest.flush(updatedSkillRating);
  });

  it('should delete a given skill rating', (done: DoneCallback) => {
    let skillRating = <SkillRating>{
      score: 5,
      _links: { self: { href: '/skills/1/skill-ratings/1' } }
    };
    let deletedSkillRating = <SkillRating>{
      score: 6,
      _links: { self: { href: '/skills/1/skill-ratings/1' } }
    };

    service.deleteSkillRating(skillRating).subscribe((rating) => {
      expect(rating).toBe(deletedSkillRating);
      done();
    });

    const testRequest = httpMock.expectOne(skillRating._links.self.href);
    expect(testRequest.request.method).toBe('DELETE');
    testRequest.flush(deletedSkillRating);
  });

  describe('getSkillRatingTitle', () => {
    it('should get the title of a new skill rating', () => {
      let skillRating = <SkillRating>{
        _links: { self: { href: '/skills/1/skill-ratings/1' } }
      };

      const title = service.getSkillRatingTitle(skillRating);

      expect(title).toBe('Best Shot');
    });

    it('should get the title of an existing skill rating', () => {
      let player = <Player>{
        firstName: 'Sven',
        lastName: 'Meier'
      };
      let skillRating = <SkillRating>{
        score: 5,
        player: player,
        _links: { self: { href: '/skills/1/skill-ratings/1' } }
      };

      const title = service.getSkillRatingTitle(skillRating);

      expect(title).toBe('Sven Meier (Best Shot)');
    });
  });
});
