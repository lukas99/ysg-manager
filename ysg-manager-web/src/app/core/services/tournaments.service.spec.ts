import { TestBed } from '@angular/core/testing';
import { TournamentsService } from './tournaments.service';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { Tournament, TournamentList } from '../../types';
import DoneCallback = jest.DoneCallback;
import { skip } from 'rxjs/operators';

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

  describe('getSelectedTournament', () => {
    const tournament1 = <Tournament>{ name: 'YSG 2019' };
    const tournament2 = <Tournament>{ name: 'YSG 2020' };
    const tournaments = [tournament1, tournament2];

    it('should set the first tournament when no tournament is selected', (done: DoneCallback) => {
      service
        .getSelectedTournament()
        .pipe(skip(1)) // skip initial empty value
        .subscribe((result) => {
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

    it('should get the selected tournament', (done: DoneCallback) => {
      service
        .getSelectedTournament()
        .pipe(skip(2)) // skip initial empty value & first default value
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

      service.setSelectedTournament(tournament2);
    });
  });

  describe('getTournaments', () => {
    it('should get the tournaments', (done: DoneCallback) => {
      const tournaments = [
        <Tournament>{ name: 'YSG 2019' },
        <Tournament>{ name: 'YSG 2020' }
      ];

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
