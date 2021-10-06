package com.lukas99.ysgmanager.domain;

import org.springframework.stereotype.Service;

/**
 * Service Implementation for managing {@link SkillTournamentRanking}.
 */
@Service
public class SkillTournamentRankingService {

  private final SkillTournamentRankingRepository skillTournamentRankingRepository;

  public SkillTournamentRankingService(
      SkillTournamentRankingRepository skillTournamentRankingRepository) {
    this.skillTournamentRankingRepository = skillTournamentRankingRepository;
  }

  /**
   * Deletes all skill tournament rankings for the given tournament.
   *
   * @param tournament The tournament for which the skill tournament rankings should be deleted.
   */
  public void deleteAll(Tournament tournament) {
    skillTournamentRankingRepository.deleteAll(
        skillTournamentRankingRepository.findBySkillTournament(tournament));
  }

}
