package com.lukas99.ysgmanager.domain;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data repository for the SkillResult entity.
 */
@Repository
public interface SkillResultRepository extends JpaRepository<SkillResult, Long> {

  /**
   * @param skill The skill for which the results should be retrieved.
   * @return The results of the given skill.
   */
  List<SkillResult> findBySkill(Skill skill);

  /**
   * @param skill The skill for which the results should be retrieved.
   * @param team  The team for which the results should be retrieved.
   * @return the results for the given skill and team
   */
  List<SkillResult> findBySkillAndPlayerTeam(Skill skill, Team team);

  /**
   * @param skill             The skill for which the results should be retrieved.
   * @param team              The team for which the results should be retrieved.
   * @param playerShirtNumber the shirt number of the player for which the results should be
   *                          retrieved
   * @return the results for the given skill, team and player shirt number
   */
  List<SkillResult> findBySkillAndPlayerTeamAndPlayerShirtNumber(
      Skill skill, Team team, Integer playerShirtNumber);

  /**
   * @param player The skill for which the results should be retrieved.
   * @return The results of the given player.
   */
  List<SkillResult> findByPlayer(Player player);

}
