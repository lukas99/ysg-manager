export interface Link {
  href: string;
}

export interface Tournament {
  name: string;
  dateDescription: string;
  _links: {
    self: Link;
  };
}

export interface TournamentList {
  _embedded: {
    tournamentModelList: Tournament[];
  };
}
