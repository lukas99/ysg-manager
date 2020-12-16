export interface Link {
  href: string;
}

export interface Tournament {
  name: string;
  dateDescription: string;
  _links: {
    self: Link;
    teams: Link;
  };
}

export interface TournamentList {
  _embedded: {
    tournamentModelList: Tournament[];
  };
}

export interface Team {
  name: string;
  _links: {
    self: Link;
    players: Link;
  };
}

export interface TeamList {
  _embedded: {
    teamModelList: Team[];
  };
}

export interface Player {
  firstName: string;
  lastName: string;
  shirtNumber: number;
  position: PlayerPosition;
  _links: {
    self: Link;
  };
}

export enum PlayerPosition {
  SKATER = 'SKATER',
  GOALTENDER = 'GOALTENDER'
}

export interface PlayerList {
  _embedded: {
    playerModelList: Player[];
  };
}
