package com.lukas99.ysgmanager.adapter.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import javax.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.lukas99.ysgmanager.adapter.rest.errors.BadRequestAlertException;
import com.lukas99.ysgmanager.domain.Tournament;
import com.lukas99.ysgmanager.domain.TournamentService;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.lukas99.ysgmanager.domain.Tournament}.
 */
@RestController
@RequestMapping("/api")
public class TournamentRestController {

  private final Logger log = LoggerFactory.getLogger(TournamentRestController.class);

  private static final String ENTITY_NAME = "tournament";

  @Value("${jhipster.clientApp.name}")
  private String applicationName;

  private final TournamentService tournamentService;

  public TournamentRestController(TournamentService tournamentService) {
    this.tournamentService = tournamentService;
  }

  /**
   * {@code POST  /tournaments} : Create a new tournament.
   *
   * @param tournament the tournament to create.
   * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new
   *         tournament, or with status {@code 400 (Bad Request)} if the tournament has already an
   *         ID.
   * @throws URISyntaxException if the Location URI syntax is incorrect.
   */
  @PostMapping("/tournaments")
  public ResponseEntity<Tournament> createTournament(@Valid @RequestBody Tournament tournament)
      throws URISyntaxException {
    log.debug("REST request to save Tournament : {}", tournament);
    if (tournament.getId() != null) {
      throw new BadRequestAlertException("A new tournament cannot already have an ID", ENTITY_NAME,
          "idexists");
    }
    Tournament result = tournamentService.save(tournament);
    return ResponseEntity.created(new URI("/api/tournaments/" + result.getId())).headers(HeaderUtil
        .createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
        .body(result);
  }

  /**
   * {@code PUT  /tournaments} : Updates an existing tournament.
   *
   * @param tournament the tournament to update.
   * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated
   *         tournament, or with status {@code 400 (Bad Request)} if the tournament is not valid, or
   *         with status {@code 500 (Internal Server Error)} if the tournament couldn't be updated.
   * @throws URISyntaxException if the Location URI syntax is incorrect.
   */
  @PutMapping("/tournaments")
  public ResponseEntity<Tournament> updateTournament(@Valid @RequestBody Tournament tournament)
      throws URISyntaxException {
    log.debug("REST request to update Tournament : {}", tournament);
    if (tournament.getId() == null) {
      throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
    }
    Tournament result = tournamentService.save(tournament);
    return ResponseEntity.ok().headers(HeaderUtil.createEntityUpdateAlert(applicationName, true,
        ENTITY_NAME, tournament.getId().toString())).body(result);
  }

  /**
   * {@code GET  /tournaments} : get all the tournaments.
   *
   * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of tournaments in
   *         body.
   */
  @GetMapping("/tournaments")
  public List<Tournament> getAllTournaments() {
    log.debug("REST request to get all Tournaments");
    return tournamentService.findAll();
  }

  /**
   * {@code GET  /tournaments/:id} : get the "id" tournament.
   *
   * @param id the id of the tournament to retrieve.
   * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the tournament,
   *         or with status {@code 404 (Not Found)}.
   */
  @GetMapping("/tournaments/{id}")
  public ResponseEntity<Tournament> getTournament(@PathVariable Long id) {
    log.debug("REST request to get Tournament : {}", id);
    Optional<Tournament> tournament = tournamentService.findOne(id);
    return ResponseUtil.wrapOrNotFound(tournament);
  }

  /**
   * {@code DELETE  /tournaments/:id} : delete the "id" tournament.
   *
   * @param id the id of the tournament to delete.
   * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
   */
  @DeleteMapping("/tournaments/{id}")
  public ResponseEntity<Void> deleteTournament(@PathVariable Long id) {
    log.debug("REST request to delete Tournament : {}", id);
    tournamentService.delete(id);
    return ResponseEntity.noContent()
        .headers(
            HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
        .build();
  }
}
