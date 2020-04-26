package com.lukas99.ysgmanager.domain;

import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Tournament}.
 */
@Service
@Transactional
public class TournamentService {

  private final Logger log = LoggerFactory.getLogger(TournamentService.class);

  private final TournamentRepository tournamentRepository;

  public TournamentService(TournamentRepository tournamentRepository) {
    this.tournamentRepository = tournamentRepository;
  }

  /**
   * Save a tournament.
   *
   * @param tournament the entity to save.
   * @return the persisted entity.
   */
  public Tournament save(Tournament tournament) {
    log.debug("Request to save Tournament : {}", tournament);
    return tournamentRepository.save(tournament);
  }

  /**
   * Get all the tournaments.
   *
   * @return the list of entities.
   */
  @Transactional(readOnly = true)
  public List<Tournament> findAll() {
    log.debug("Request to get all Tournaments");
    return tournamentRepository.findAll();
  }


  /**
   * Get one tournament by id.
   *
   * @param id the id of the entity.
   * @return the entity.
   */
  @Transactional(readOnly = true)
  public Optional<Tournament> findOne(Long id) {
    log.debug("Request to get Tournament : {}", id);
    return tournamentRepository.findById(id);
  }

  /**
   * Delete the tournament by id.
   *
   * @param id the id of the entity.
   */
  public void delete(Long id) {
    log.debug("Request to delete Tournament : {}", id);
    tournamentRepository.deleteById(id);
  }
}
