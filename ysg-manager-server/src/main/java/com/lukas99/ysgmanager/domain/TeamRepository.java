package com.lukas99.ysgmanager.domain;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data repository for the Team entity.
 */
@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {

  /**
   * @param tournament The tournament for which the teams should be retrieved.
   * @return The teams of the given tournament.
   */
  List<Team> findByTournament(Tournament tournament);

}
