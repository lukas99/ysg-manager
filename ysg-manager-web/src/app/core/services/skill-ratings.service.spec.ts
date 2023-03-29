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
  SkillRating,
  SkillRatingList,
  SkillType,
  Team,
  Tournament,
  TournamentList
} from '../../types';
import { SkillRatingsService } from './skill-ratings.service';
import { SkillsService } from './skills.service';
import { TournamentsService } from './tournaments.service';
import DoneCallback = jest.DoneCallback;

describe('SkillRatingsService', () => {
  let service: SkillRatingsService;
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
      getSelectedItemValue: jest.fn(() => skill)
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: SkillsService, useValue: skillsService }]
    });
    service = TestBed.inject(SkillRatingsService);
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

  it('should get a skill rating', (done) => {
    const skillRating = <SkillRating>{ id: 2, score: 5 };

    service.getSkillRating(2).subscribe((result) => {
      expect(result).toBe(skillRating);
      done();
    });

    const testRequest = httpMock.expectOne('skill-ratings/2');
    expect(testRequest.request.method).toBe('GET');
    testRequest.flush(skillRating);
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

  describe('getSkillRatingsBySkillAndTeam', () => {
    it('should get the skillRatings of a skill filtered by team', (done: DoneCallback) => {
      const skillRatings = [
        <SkillRating>{ score: 80 },
        <SkillRating>{ score: 90 }
      ];

      service.getSkillRatingsBySkillAndTeam(skill, team).subscribe((rating) => {
        expect(rating).toHaveLength(2);
        expect(rating).toEqual(skillRatings);
        done();
      });

      const testRequest = httpMock.expectOne(
        '/skills/1/skill-ratings?teamId=26'
      );
      expect(testRequest.request.method).toBe('GET');
      testRequest.flush(<SkillRatingList>{
        _embedded: {
          skillRatingModelList: skillRatings
        }
      });
    });

    it('should return an empty list when no ratings are available', (done: DoneCallback) => {
      service.getSkillRatingsBySkillAndTeam(skill, team).subscribe((rating) => {
        expect(rating).toHaveLength(0);
        done();
      });

      const testRequest = httpMock.expectOne(
        '/skills/1/skill-ratings?teamId=26'
      );
      expect(testRequest.request.method).toBe('GET');
      testRequest.flush(<PlayerList>{});
    });
  });

  describe('getSkillRatingsBySkillAndTeamAndPlayerShirtNumber', () => {
    it('should get the skillRatings of a skill filtered by team and shirt number', (done: DoneCallback) => {
      const skillRatings = [
        <SkillRating>{ score: 80 },
        <SkillRating>{ score: 90 }
      ];

      service
        .getSkillRatingsBySkillAndTeamAndPlayerShirtNumber(skill, team, 99)
        .subscribe((rating) => {
          expect(rating).toHaveLength(2);
          expect(rating).toEqual(skillRatings);
          done();
        });

      const testRequest = httpMock.expectOne(
        '/skills/1/skill-ratings?teamId=26&playerShirtNumber=99'
      );
      expect(testRequest.request.method).toBe('GET');
      testRequest.flush(<SkillRatingList>{
        _embedded: {
          skillRatingModelList: skillRatings
        }
      });
    });

    it('should return an empty list when no ratings are available', (done: DoneCallback) => {
      service
        .getSkillRatingsBySkillAndTeamAndPlayerShirtNumber(skill, team, 99)
        .subscribe((rating) => {
          expect(rating).toHaveLength(0);
          done();
        });

      const testRequest = httpMock.expectOne(
        '/skills/1/skill-ratings?teamId=26&playerShirtNumber=99'
      );
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
