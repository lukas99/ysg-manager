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
   * @param player The skill for which the results should be retrieved.
   * @return The results of the given player.
   */
  List<SkillResult> findByPlayer(Player player);

}
