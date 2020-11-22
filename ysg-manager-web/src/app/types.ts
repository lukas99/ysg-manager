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
  };
}

export interface TeamList {
  _embedded: {
    teamModelList: Team[];
  };
}
