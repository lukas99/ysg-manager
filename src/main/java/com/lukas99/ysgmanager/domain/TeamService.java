package com.lukas99.ysgmanager.domain;

import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Team}.
 */
@Service
@Transactional
public class TeamService {

  private final Logger log = LoggerFactory.getLogger(TeamService.class);

  private final TeamRepository teamRepository;

  public TeamService(TeamRepository teamRepository) {
    this.teamRepository = teamRepository;
  }

  /**
   * Save a team.
   *
   * @param team the entity to save.
   * @return the persisted entity.
   */
  public Team save(Team team) {
    log.debug("Request to save Team : {}", team);
    return teamRepository.save(team);
  }

  /**
   * Get all the teams.
   *
   * @return the list of entities.
   */
  @Transactional(readOnly = true)
  public List<Team> findAll() {
    log.debug("Request to get all Teams");
    return teamRepository.findAll();
  }


  /**
   * Get one team by id.
   *
   * @param id the id of the entity.
   * @return the entity.
   */
  @Transactional(readOnly = true)
  public Optional<Team> findOne(Long id) {
    log.debug("Request to get Team : {}", id);
    return teamRepository.findById(id);
  }

  /**
   * Delete the team by id.
   *
   * @param id the id of the entity.
   */
  public void delete(Long id) {
    log.debug("Request to delete Team : {}", id);
    teamRepository.deleteById(id);
  }
}
