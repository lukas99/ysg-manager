import { TestBed } from '@angular/core/testing';
import { SkillsService } from './skills.service';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { Skill, SkillList, Tournament, TournamentList } from '../../types';
import { TournamentsService } from './tournaments.service';
import DoneCallback = jest.DoneCallback;

describe('SkillsService', () => {
  let service: SkillsService;
  let tournamentSerivce: TournamentsService;
  let httpMock: HttpTestingController;

  let tournament: Tournament = {
    name: 'YSG 2019',
    dateDescription: '2019',
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
    service = TestBed.inject(SkillsService);
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

  describe('getSkills', () => {
    it('should get the skills of a tournament', (done: DoneCallback) => {
      const skills = [
        <Skill>{ name: 'Magic Transitions' },
        <Skill>{ name: 'Best Shot' }
      ];

      service.getSkills().subscribe((result) => {
        expect(result).toHaveLength(2);
        expect(result).toEqual(skills);
        done();
      });

      const testRequest = httpMock.expectOne('tournaments/1/skills');
      expect(testRequest.request.method).toBe('GET');
      testRequest.flush(<SkillList>{
        _embedded: {
          skillModelList: skills
        }
      });
    });

    it('should return an empty list when no skills are available', (done: DoneCallback) => {
      service.getSkills().subscribe((result) => {
        expect(result).toHaveLength(0);
        done();
      });

      const testRequest = httpMock.expectOne('tournaments/1/skills');
      expect(testRequest.request.method).toBe('GET');
      testRequest.flush(<SkillList>{});
    });
  });

  it('should create a new skill', (done: DoneCallback) => {
    let skill = <Skill>{
      name: 'Magic Transitions'
    };
    let createdSkill = <Skill>{
      name: 'Magic Transitions created',
      _links: { self: { href: 'skills/1' } }
    };

    service.createSkill(skill).subscribe((result) => {
      expect(result).toBe(createdSkill);
      done();
    });

    const testRequest = httpMock.expectOne('tournaments/1/skills');
    expect(testRequest.request.method).toBe('POST');
    testRequest.flush(createdSkill);
  });

  it('should update a given skill', (done: DoneCallback) => {
    let skill = <Skill>{
      name: 'Magic Transitions',
      _links: { self: { href: 'skills/1' } }
    };
    let updatedSkill = <Skill>{
      name: 'Heat Transitions',
      _links: { self: { href: 'skills/1' } }
    };

    service.updateSkill(skill).subscribe((result) => {
      expect(result).toBe(updatedSkill);
      done();
    });

    const testRequest = httpMock.expectOne(skill._links.self.href);
    expect(testRequest.request.method).toBe('PUT');
    testRequest.flush(updatedSkill);
  });

  it('should delete a given skill', (done: DoneCallback) => {
    let skill = <Skill>{
      name: 'Magic Transitions',
      _links: { self: { href: 'skills/1' } }
    };
    let deletedSkill = <Skill>{
      name: 'Magic Transitions deleted',
      _links: { self: { href: 'skills/1' } }
    };

    service.deleteSkill(skill).subscribe((result) => {
      expect(result).toBe(deletedSkill);
      done();
    });

    const testRequest = httpMock.expectOne(skill._links.self.href);
    expect(testRequest.request.method).toBe('DELETE');
    testRequest.flush(deletedSkill);
  });

  it('should get a skills title', () => {
    let skill = <Skill>{
      name: 'Magic Transitions'
    };

    const title = service.getSkillTitle(skill);

    expect(title).toBe('Magic Transitions');
  });

  it('should calculate the skill rankings', (done: DoneCallback) => {
    service.calculateSkillRankings().subscribe(() => {
      done();
    });

    const testRequest = httpMock.expectOne(
      'tournaments/1/skills/calculate-rankings'
    );
    expect(testRequest.request.method).toBe('POST');
    testRequest.flush({});
  });
});
