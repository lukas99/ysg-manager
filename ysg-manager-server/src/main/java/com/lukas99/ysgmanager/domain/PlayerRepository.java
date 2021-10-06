package com.lukas99.ysgmanager.domain;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Player entity.
 */
@Repository
public interface PlayerRepository
    extends JpaRepository<Player, Long>, JpaSpecificationExecutor<Player> {

  /**
   * @param team The team for which the players should be retrieved.
   * @return The players of the given team.
   */
  List<Player> findByTeam(Team team);

  /**
   * @param position The players with this position will be retrieved.
   * @return The players with the given position.
   */
  List<Player> findByPosition(PlayerPosition position);
}
