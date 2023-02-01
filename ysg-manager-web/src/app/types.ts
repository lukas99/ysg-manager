/**
 * Types should extend from CacheSupport when caching should be possible for them.
 */
export interface CacheSupport {
  isCached?: boolean;
  cacheId?: string;
}

export interface Link {
  href: string;
}

export interface Tournament extends CacheSupport {
  name: string;
  dateDescription: string;
  active: boolean;
  _links: {
    self: Link;
    teams: Link;
    skills: Link;
    calculateskillrankings: Link;
    skillrankings: Link;
    skilltournamentrankings: Link;
  };
}

export interface TournamentList {
  _embedded: {
    tournamentModelList: Tournament[];
  };
}

export interface Team extends CacheSupport {
  id: number;
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
  team: Team;
  _links: {
    self: Link;
    team: Link;
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

export interface Skill extends CacheSupport {
  typeForPlayers: SkillType;
  typeForGoaltenders: SkillType;
  tournamentRankingPlayerPosition: PlayerPosition;
  name: string;
  number: number;
  _links: {
    self: Link;
    tournament: Link;
    skillresults: Link;
    skillResultsByTeam: Link;
    skillResultsByTeamAndPlayerShirtNumber: Link;
    skillratings: Link;
    skillRatingsByTeam: Link;
    skillRatingsByTeamAndPlayerShirtNumber: Link;
  };
}

export enum SkillType {
  TIME_WITH_RATING = 'TIME_WITH_RATING',
  TIME_WITH_POINTS = 'TIME_WITH_POINTS',
  TIME = 'TIME',
  POINTS = 'POINTS',
  RATING = 'RATING',
  GOALTENDERS_OVERALL = 'GOALTENDERS_OVERALL',
  NO_RESULTS = 'NO_RESULTS'
}

export interface SkillList {
  _embedded: {
    skillModelList: Skill[];
  };
}

export interface SkillResult extends CacheSupport {
  time: number;
  failures: number;
  points: number;
  player: Player;
  _links: {
    self: Link;
    player: Link;
    skill: Link;
  };
}

export interface SkillResultList {
  _embedded: {
    skillResultModelList: SkillResult[];
  };
}

export interface SkillRating extends CacheSupport {
  score: number;
  player: Player;
  _links: {
    self: Link;
    player: Link;
    skill: Link;
  };
}

export interface SkillRatingList {
  _embedded: {
    skillRatingModelList: SkillRating[];
  };
}

export interface Ranking {
  skill: Skill;
  player: Player;
  rank: number;
  sequence: number;
  _links: {
    self: Link;
    player: Link;
    skill: Link;
  };
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SkillRanking extends Ranking {}

export interface SkillRankingList {
  _embedded: {
    skillRankingModelList: SkillRanking[];
  };
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SkillTournamentRanking extends Ranking {}

export interface SkillTournamentRankingList {
  _embedded: {
    skillTournamentRankingModelList: SkillTournamentRanking[];
  };
}
