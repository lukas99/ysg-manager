package com.lukas99.ysgmanager.domain;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data repository for the SkillRating entity.
 */
@Repository
public interface SkillRatingRepository extends JpaRepository<SkillRating, Long> {

  /**
   * @param skill The skill for which the ratings should be retrieved.
   * @return The ratings of the given skill.
   */
  List<SkillRating> findBySkill(Skill skill);

  /**
   * @param player The player for which the ratings should be retrieved.
   * @return The ratings of the given player.
   */
  List<SkillRating> findByPlayer(Player player);

}
