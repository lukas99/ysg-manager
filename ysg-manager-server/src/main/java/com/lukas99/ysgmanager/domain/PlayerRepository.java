package com.lukas99.ysgmanager.domain;

import java.util.List;
import java.util.Optional;
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
   * @param shirtNumber the shirt number of the player
   * @param team        the team of the player
   * @return an Optional of the player with the given shirt number and team
   */
  Optional<Player> findByShirtNumberAndTeam(Integer shirtNumber, Team team);

  /**
   * @param team The team for which the players should be retrieved.
   * @return The players of the given team.
   */
  List<Player> findByTeam(Team team);

  /**
   * @param position   The players with this position will be retrieved.
   * @param tournament The tournament to which the retrieved players should belong.
   * @return The players with the given position and the given tournament.
   */
  List<Player> findByPositionAndTeamTournament(
      PlayerPosition position, Tournament tournament);

}
