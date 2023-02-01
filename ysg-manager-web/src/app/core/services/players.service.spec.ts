import { TestBed } from '@angular/core/testing';
import { PlayersService } from './players.service';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { Player, PlayerList, Team } from '../../types';
import { TeamsService } from './teams.service';
import DoneCallback = jest.DoneCallback;

describe('PlayersService', () => {
  let service: PlayersService;
  let teamService: TeamsService;
  let httpMock: HttpTestingController;

  let team: Team = {
    id: 26,
    name: 'EHC Engelberg',
    _links: {
      self: { href: 'teams/1' },
      players: { href: 'teams/1/players' }
    }
  };

  beforeEach(() => {
    teamService = <any>{
      getSelectedItemValue: jest.fn(() => team)
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: TeamsService, useValue: teamService }]
    });
    service = TestBed.inject(PlayersService);
    teamService = TestBed.inject(TeamsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get a player', (done: DoneCallback) => {
    const player = <Player>{ _links: { self: { href: 'players/1' } } };

    service.getPlayer(player._links.self).subscribe((result) => {
      expect(result).toEqual(player);
      done();
    });

    const testRequest = httpMock.expectOne('players/1');
    expect(testRequest.request.method).toBe('GET');
    testRequest.flush(player);
  });

  describe('getPlayers', () => {
    it('should get the players of a team', (done: DoneCallback) => {
      const players = [
        <Player>{ firstName: 'Sven' },
        <Player>{ firstName: 'Peter' }
      ];

      service.getPlayers(team).subscribe((result) => {
        expect(result).toHaveLength(2);
        expect(result).toEqual(players);
        done();
      });

      const testRequest = httpMock.expectOne('teams/1/players');
      expect(testRequest.request.method).toBe('GET');
      testRequest.flush(<PlayerList>{
        _embedded: {
          playerModelList: players
        }
      });
    });

    it('should return an empty list when no players are available', (done: DoneCallback) => {
      service.getPlayers(team).subscribe((result) => {
        expect(result).toHaveLength(0);
        done();
      });

      const testRequest = httpMock.expectOne('teams/1/players');
      expect(testRequest.request.method).toBe('GET');
      testRequest.flush(<PlayerList>{});
    });
  });

  it('should create a new player', (done: DoneCallback) => {
    let player = <Player>{
      firstName: 'Sven'
    };
    let createdPlayer = <Player>{
      firstName: 'Sven',
      _links: { self: { href: 'players/1' } }
    };

    service.createPlayer(player, team).subscribe((result) => {
      expect(result).toBe(createdPlayer);
      done();
    });

    const testRequest = httpMock.expectOne('teams/1/players');
    expect(testRequest.request.method).toBe('POST');
    testRequest.flush(createdPlayer);
  });

  it('should update a given player', (done: DoneCallback) => {
    let player = <Player>{
      firstName: 'Sven',
      _links: { self: { href: 'players/1' } }
    };
    let updatedPlayer = <Player>{
      firstName: 'Sven',
      _links: { self: { href: 'players/1' } }
    };

    service.updatePlayer(player).subscribe((result) => {
      expect(result).toBe(updatedPlayer);
      done();
    });

    const testRequest = httpMock.expectOne(player._links.self.href);
    expect(testRequest.request.method).toBe('PUT');
    testRequest.flush(updatedPlayer);
  });

  it('should delete a given player', (done: DoneCallback) => {
    let player = <Player>{
      firstName: 'Sven',
      _links: { self: { href: 'players/1' } }
    };
    let deletedPlayer = <Player>{
      firstName: 'Sven',
      _links: { self: { href: 'players/1' } }
    };

    service.deletePlayer(player).subscribe((result) => {
      expect(result).toBe(deletedPlayer);
      done();
    });

    const testRequest = httpMock.expectOne(player._links.self.href);
    expect(testRequest.request.method).toBe('DELETE');
    testRequest.flush(deletedPlayer);
  });

  it('should get a players title', () => {
    let player = <Player>{
      firstName: 'Sven',
      lastName: 'Meier'
    };

    const title = service.getPlayerTitle(player);

    expect(title).toBe('Sven Meier (EHC Engelberg)');
  });
});
