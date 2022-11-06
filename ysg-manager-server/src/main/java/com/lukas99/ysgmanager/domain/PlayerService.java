package com.lukas99.ysgmanager.domain;

import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Player}.
 */
@Service
@Transactional
public class PlayerService {

  private final Logger log = LoggerFactory.getLogger(PlayerService.class);

  private final PlayerRepository playerRepository;

  public PlayerService(PlayerRepository playerRepository) {
    this.playerRepository = playerRepository;
  }

  /**
   * Save a player.
   *
   * @param player the entity to save.
   * @return the persisted entity.
   */
  public Player save(Player player) {
    return playerRepository.save(player);
  }

  /**
   * Get all the players.
   *
   * @param pageable the pagination information.
   * @return the list of entities.
   */
  @Transactional(readOnly = true)
  public Page<Player> findAll(Pageable pageable) {
    return playerRepository.findAll(pageable);
  }


  /**
   * Get one player by id.
   *
   * @param id the id of the entity.
   * @return the entity.
   */
  @Transactional(readOnly = true)
  public Optional<Player> findOne(Long id) {
    return playerRepository.findById(id);
  }

  /**
   * Get a player by shirt number and team.
   *
   * @param shirtNumber the shirt number of the player
   * @param team        the team of the player
   * @return an Optional of the player with the given shirt number and team
   */
  @Transactional(readOnly = true)
  public Optional<Player> findByShirtNumberAndTeam(Integer shirtNumber, Team team) {
    return playerRepository.findByShirtNumberAndTeam(shirtNumber, team);
  }

  /**
   * Delete the player by id.
   *
   * @param id the id of the entity.
   */
  public void delete(Long id) {
    playerRepository.deleteById(id);
  }

  /**
   * @param team The team for which the players should be retrieved.
   * @return The players of the given team.
   */
  public List<Player> findByTeam(Team team) {
    return playerRepository.findByTeam(team);
  }

}
