package com.lukas99.ysgmanager.domain;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data repository for the Skill entity.
 */
@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {

  /**
   * @param tournament The tournament for which the skills should be retrieved.
   * @return The skills of the given tournament.
   */
  List<Skill> findByTournament(Tournament tournament);

}
