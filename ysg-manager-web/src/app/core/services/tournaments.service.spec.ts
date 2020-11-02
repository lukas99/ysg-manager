import { TestBed } from '@angular/core/testing';
import { TournamentsService } from './tournaments.service';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { Tournament, TournamentList } from '../../types';

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

  it('should get the tournaments', () => {
    const tournaments = [
      <Tournament>{ name: 'YSG 2019' },
      <Tournament>{ name: 'YSG 2020' }
    ];

    service.getTournaments().subscribe((result) => {
      expect(result).toHaveLength(2);
      expect(result).toEqual(tournaments);
    });

    const testRequest = httpMock.expectOne(service['tournamentsUrl']);
    expect(testRequest.request.method).toBe('GET');
    testRequest.flush(<TournamentList>{
      _embedded: {
        tournamentModelList: tournaments
      }
    });
  });

  it('should create a new tournament', () => {
    let tournament = <Tournament>{
      name: 'YSG 2019'
    };
    let createdTournament = <Tournament>{
      name: 'YSG 2019 created',
      _links: { self: { href: 'tournaments/1' } }
    };

    service.createTournament(tournament).subscribe((result) => {
      expect(result).toBe(createdTournament);
    });

    const testRequest = httpMock.expectOne(service['tournamentsUrl']);
    expect(testRequest.request.method).toBe('POST');
    testRequest.flush(createdTournament);
  });

  it('should update a given tournament', () => {
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
    });

    const testRequest = httpMock.expectOne(tournament._links.self.href);
    expect(testRequest.request.method).toBe('PUT');
    testRequest.flush(updatedTournament);
  });

  it('should delete a given tournament', () => {
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
