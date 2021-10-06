package com.lukas99.ysgmanager.domain;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data repository for the SkillTournamentRanking entity.
 */
@Repository
public interface SkillTournamentRankingRepository
    extends JpaRepository<SkillTournamentRanking, Long> {

  /**
   * @param skill The skill for which the tournament rankings should be retrieved.
   * @return The tournament rankings of the given skill.
   */
  List<SkillTournamentRanking> findBySkillOrderBySequenceAsc(Skill skill);

  /**
   * @param tournament The tournament for which the tournament rankings should be retrieved.
   * @return All tournament rankings for the given tournament.
   */
  List<SkillTournamentRanking> findBySkillTournament(Tournament tournament);

}
