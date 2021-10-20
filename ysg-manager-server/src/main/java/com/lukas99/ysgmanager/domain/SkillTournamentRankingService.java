package com.lukas99.ysgmanager.domain;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
   * Get one skill tournament ranking by id.
   *
   * @param id the id of the entity.
   * @return the entity.
   */
  @Transactional(readOnly = true)
  public Optional<SkillTournamentRanking> findOne(Long id) {
    return skillTournamentRankingRepository.findById(id);
  }

  /**
   * @param tournament The tournament for which the tournament rankings should be retrieved.
   * @return All tournament rankings for the given tournament.
   */
  public List<SkillTournamentRanking> findByTournament(Tournament tournament) {
    return skillTournamentRankingRepository.findBySkillTournament(tournament);
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
