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
import com.lukas99.ysgmanager.adapter.rest.errors.BadRequestException;
import com.lukas99.ysgmanager.domain.Team;
import com.lukas99.ysgmanager.domain.TeamService;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.lukas99.ysgmanager.domain.Team}.
 */
@RestController
@RequestMapping("/api")
public class TeamRestController {

  private final Logger log = LoggerFactory.getLogger(TeamRestController.class);

  private static final String ENTITY_NAME = "team";

  @Value("${jhipster.clientApp.name}")
  private String applicationName;

  private final TeamService teamService;

  public TeamRestController(TeamService teamService) {
    this.teamService = teamService;
  }

  /**
   * {@code POST  /teams} : Create a new team.
   *
   * @param team the team to create.
   * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new
   *         team, or with status {@code 400 (Bad Request)} if the team has already an ID.
   * @throws URISyntaxException if the Location URI syntax is incorrect.
   */
  @PostMapping("/teams")
  public ResponseEntity<Team> createTeam(@Valid @RequestBody Team team) throws URISyntaxException {
    log.debug("REST request to save Team : {}", team);
    if (team.getId() != null) {
      throw new BadRequestException("A new team cannot already have an ID");
    }
    Team result = teamService.save(team);
    return ResponseEntity.created(new URI("/api/teams/" + result.getId())).headers(HeaderUtil
        .createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
        .body(result);
  }

  /**
   * {@code PUT  /teams} : Updates an existing team.
   *
   * @param team the team to update.
   * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated team,
   *         or with status {@code 400 (Bad Request)} if the team is not valid, or with status
   *         {@code 500 (Internal Server Error)} if the team couldn't be updated.
   * @throws URISyntaxException if the Location URI syntax is incorrect.
   */
  @PutMapping("/teams")
  public ResponseEntity<Team> updateTeam(@Valid @RequestBody Team team) throws URISyntaxException {
    log.debug("REST request to update Team : {}", team);
    if (team.getId() == null) {
      throw new BadRequestException("Invalid id. It is null.");
    }

    Team existingTeam = teamService.findOne(team.getId()).get();
    existingTeam.update(team);

    Team result = teamService.save(existingTeam);
    return ResponseEntity.ok().headers(HeaderUtil.createEntityUpdateAlert(applicationName, true,
        ENTITY_NAME, team.getId().toString())).body(result);
  }

  /**
   * {@code GET  /teams} : get all the teams.
   *
   * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of teams in body.
   */
  @GetMapping("/teams")
  public List<Team> getAllTeams() {
    log.debug("REST request to get all Teams");
    return teamService.findAll();
  }

  /**
   * {@code GET  /teams/:id} : get the "id" team.
   *
   * @param id the id of the team to retrieve.
   * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the team, or with
   *         status {@code 404 (Not Found)}.
   */
  @GetMapping("/teams/{id}")
  public ResponseEntity<Team> getTeam(@PathVariable Long id) {
    log.debug("REST request to get Team : {}", id);
    Optional<Team> team = teamService.findOne(id);
    return ResponseUtil.wrapOrNotFound(team);
  }

  /**
   * {@code DELETE  /teams/:id} : delete the "id" team.
   *
   * @param id the id of the team to delete.
   * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
   */
  @DeleteMapping("/teams/{id}")
  public ResponseEntity<Void> deleteTeam(@PathVariable Long id) {
    log.debug("REST request to delete Team : {}", id);
    teamService.delete(id);
    return ResponseEntity.noContent()
        .headers(
            HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
        .build();
  }
}
