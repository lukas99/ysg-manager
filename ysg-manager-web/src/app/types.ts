export interface Tournament {
  name: string;
  dateDescription?: string;
}

export interface TournamentList {
  _embedded: {
    tournamentModelList: Tournament[];
  };
}
