package com.lukas99.ysgmanager.domain;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data repository for the SkillRating entity.
 */
@Repository
public interface SkillRankingRepository extends JpaRepository<SkillRanking, Long> {

  /**
   * @param skill The skill for which the rankings should be retrieved.
   * @return The rankings of the given skill.
   */
  List<SkillRanking> findBySkillOrderBySequenceAsc(Skill skill);

  /**
   * @param skill    The skill for which the rankings should be retrieved.
   * @param position Only rankings of players with this position will be retrieved.
   * @return The rankings of the given skill for only the players with the given position.
   */
  List<SkillRanking> findBySkillAndPlayerPositionOrderBySequenceAsc(
      Skill skill, PlayerPosition position);

  /**
   * @param player     The player for which the rankings should be retrieved.
   * @param tournament The tournament for which the rankings should be retrieved.
   * @return All rankings for a player of a tournament.
   */
  List<SkillRanking> findByPlayerAndSkillTournament(Player player, Tournament tournament);

  /**
   * @param tournament The tournament for which the rankings should be retrieved.
   * @return All rankings for the given tournament.
   */
  List<SkillRanking> findBySkillTournament(Tournament tournament);

}
