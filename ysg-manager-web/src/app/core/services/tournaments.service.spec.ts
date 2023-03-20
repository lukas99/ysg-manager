import { TestBed } from '@angular/core/testing';
import { TournamentsService } from './tournaments.service';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { Tournament, TournamentList } from '../../types';
import { skip } from 'rxjs/operators';
import DoneCallback = jest.DoneCallback;

describe('TournamentsService', () => {
  let service: TournamentsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(TournamentsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getApplicationTournament', () => {
    const tournament1 = <Tournament>{
      name: 'YSG 2019',
      active: false,
      _links: {}
    };
    const tournament2 = <Tournament>{
      name: 'YSG 2020',
      active: true,
      _links: {}
    };
    const tournaments = [tournament1, tournament2];

    it('should set the active tournament when no application tournament exists', (done: DoneCallback) => {
      service.getApplicationTournament().subscribe((result) => {
        expect(result).toBe(tournament2);
        done();
      });

      const testRequest = httpMock.expectOne(service['tournamentsUrl']);
      expect(testRequest.request.method).toBe('GET');
      testRequest.flush(<TournamentList>{
        _embedded: {
          tournamentModelList: tournaments
        }
      });
    });

    it('should set the first tournament when no application tournament exists', (done: DoneCallback) => {
      tournament1.active = false;
      tournament2.active = false;

      service.getApplicationTournament().subscribe((result) => {
        expect(result).toBe(tournament1);
        done();
      });

      const testRequest = httpMock.expectOne(service['tournamentsUrl']);
      expect(testRequest.request.method).toBe('GET');
      testRequest.flush(<TournamentList>{
        _embedded: {
          tournamentModelList: tournaments
        }
      });
    });

    it('should get the application tournament', (done: DoneCallback) => {
      service
        .getApplicationTournament()
        .pipe(skip(1)) // skip first default value
        .subscribe((result) => {
          expect(result).toBe(tournament2);
          done();
        });

      const testRequest = httpMock.expectOne(service['tournamentsUrl']);
      expect(testRequest.request.method).toBe('GET');
      testRequest.flush(<TournamentList>{
        _embedded: {
          tournamentModelList: tournaments
        }
      });

      service.setApplicationTournament(tournament2);
    });
  });

  describe('getTournaments', () => {
    let tournaments: Tournament[];

    beforeEach(() => {
      tournaments = [
        <Tournament>{ name: 'YSG 2019' },
        <Tournament>{ name: 'YSG 2020' }
      ];
      localStorage.removeItem('ysg-tournaments');
    });

    afterEach(() => {
      localStorage.removeItem('ysg-tournaments');
    });

    it('should get the tournaments', (done: DoneCallback) => {
      service.getTournaments().subscribe((result) => {
        expect(result.length).toBe(2);
        expect(result).toEqual(tournaments);
        done();
      });

      const testRequest = httpMock.expectOne(service['tournamentsUrl']);
      expect(testRequest.request.method).toBe('GET');
      testRequest.flush(<TournamentList>{
        _embedded: {
          tournamentModelList: tournaments
        }
      });
    });

    it('should return an empty list when no tournaments are available', (done: DoneCallback) => {
      service.getTournaments().subscribe((result) => {
        expect(result).toHaveLength(0);
        done();
      });

      const testRequest = httpMock.expectOne(service['tournamentsUrl']);
      expect(testRequest.request.method).toBe('GET');
      testRequest.flush(<TournamentList>{});
    });
  });

  it('should create a new tournament', (done: DoneCallback) => {
    let tournament = <Tournament>{
      name: 'YSG 2019'
    };
    let createdTournament = <Tournament>{
      name: 'YSG 2019 created',
      _links: { self: { href: 'tournaments/1' } }
    };

    service.createTournament(tournament).subscribe((result) => {
      expect(result).toBe(createdTournament);
      done();
    });

    const testRequest = httpMock.expectOne(service['tournamentsUrl']);
    expect(testRequest.request.method).toBe('POST');
    testRequest.flush(createdTournament);
  });

  it('should update a given tournament', (done: DoneCallback) => {
    let tournament = <Tournament>{
      name: 'YSG 2019',
      _links: { self: { href: 'tournaments/1' } }
    };
    let updatedTournament = <Tournament>{
      name: 'YSG 2020',
      _links: { self: { href: 'tournaments/1' } }
    };

    service.updateTournament(tournament).subscribe((result) => {
      expect(result).toBe(updatedTournament);
      done();
    });

    const testRequest = httpMock.expectOne(tournament._links.self.href);
    expect(testRequest.request.method).toBe('PUT');
    testRequest.flush(updatedTournament);
  });

  it('should delete a given tournament', (done: DoneCallback) => {
    let tournament = <Tournament>{
      name: 'YSG 2019',
      _links: { self: { href: 'tournaments/1' } }
    };
    let deletedTournament = <Tournament>{
      name: 'YSG 2019 deleted',
      _links: { self: { href: 'tournaments/1' } }
    };

    service.deleteTournament(tournament).subscribe((result) => {
      expect(result).toBe(deletedTournament);
      done();
    });

    const testRequest = httpMock.expectOne(tournament._links.self.href);
    expect(testRequest.request.method).toBe('DELETE');
    testRequest.flush(deletedTournament);
  });

  it('should get a tournaments title', () => {
    let tournament = <Tournament>{
      name: 'YSG 2019'
    };

    const title = service.getTournamentTitle(tournament);

    expect(title).toBe('YSG 2019');
  });
});
