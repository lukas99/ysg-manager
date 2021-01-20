export interface Link {
  href: string;
}

export interface Tournament {
  name: string;
  dateDescription: string;
  _links: {
    self: Link;
    teams: Link;
    skills: Link;
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

export interface Skill {
  skillType: SkillType;
  name: string;
  number: number;
  _links: {
    self: Link;
    tournament: Link;
  };
}

export enum SkillType {
  TIME_WITH_RATING = 'TIME_WITH_RATING',
  TIME_WITH_POINTS = 'TIME_WITH_POINTS',
  TIME = 'TIME',
  POINTS = 'POINTS'
}

export interface SkillList {
  _embedded: {
    skillModelList: Skill[];
  };
}
