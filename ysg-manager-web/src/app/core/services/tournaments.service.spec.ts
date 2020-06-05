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

  it('should save a given tournament', () => {
    let tournament = <Tournament>{
      name: 'YSG 2019',
      _links: { self: { href: 'tournaments/1' } }
    };
    let updatedTournament = <Tournament>{
      name: 'YSG 2020',
      _links: { self: { href: 'tournaments/1' } }
    };

    service.saveTournament(tournament).subscribe((result) => {
      expect(result).toBe(updatedTournament);
    });

    const testRequest = httpMock.expectOne(tournament._links.self.href);
    expect(testRequest.request.method).toBe('PUT');
    testRequest.flush(updatedTournament);
  });
});
