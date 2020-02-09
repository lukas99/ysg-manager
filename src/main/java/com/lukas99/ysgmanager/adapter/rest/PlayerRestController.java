package com.lukas99.ysgmanager.adapter.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import javax.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import com.lukas99.ysgmanager.adapter.rest.errors.BadRequestException;
import com.lukas99.ysgmanager.domain.Player;
import com.lukas99.ysgmanager.domain.PlayerService;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.lukas99.ysgmanager.domain.Player}.
 */
@RestController
@RequestMapping("/api")
public class PlayerRestController {

  private final Logger log = LoggerFactory.getLogger(PlayerRestController.class);

  private static final String ENTITY_NAME = "player";

  @Value("${jhipster.clientApp.name}")
  private String applicationName;

  private final PlayerService playerService;

  public PlayerRestController(PlayerService playerService) {
    this.playerService = playerService;
  }

  /**
   * {@code POST  /players} : Create a new player.
   *
   * @param player the player to create.
   * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new
   *         player, or with status {@code 400 (Bad Request)} if the player has already an ID.
   * @throws URISyntaxException if the Location URI syntax is incorrect.
   */
  @PostMapping("/players")
  public ResponseEntity<Player> createPlayer(@Valid @RequestBody Player player)
      throws URISyntaxException {
    log.debug("REST request to save Player : {}", player);
    if (player.getId() != null) {
      throw new BadRequestException("A new player cannot already have an ID");
    }
    Player result = playerService.save(player);
    return ResponseEntity.created(new URI("/api/players/" + result.getId())).headers(HeaderUtil
        .createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
        .body(result);
  }

  /**
   * {@code PUT  /players} : Updates an existing player.
   *
   * @param player the player to update.
   * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated
   *         player, or with status {@code 400 (Bad Request)} if the player is not valid, or with
   *         status {@code 500 (Internal Server Error)} if the player couldn't be updated.
   * @throws URISyntaxException if the Location URI syntax is incorrect.
   */
  @PutMapping("/players")
  public ResponseEntity<Player> updatePlayer(@Valid @RequestBody Player player)
      throws URISyntaxException {
    log.debug("REST request to update Player : {}", player);
    if (player.getId() == null) {
      throw new BadRequestException("Invalid id. It is null.");
    }

    Player existingPlayer = playerService.findOne(player.getId()).get();
    existingPlayer.update(player);

    Player result = playerService.save(existingPlayer);
    return ResponseEntity.ok().headers(HeaderUtil.createEntityUpdateAlert(applicationName, true,
        ENTITY_NAME, player.getId().toString())).body(result);
  }

  /**
   * {@code GET  /players} : get all the players.
   * 
   * @param pageable the pagination information.
   * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of players in
   *         body.
   */
  @GetMapping("/players")
  public ResponseEntity<List<Player>> getAllPlayers(Pageable pageable) {
    log.debug("REST request to get all Players");
    Page<Player> page = playerService.findAll(pageable);
    HttpHeaders headers = PaginationUtil
        .generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
    return ResponseEntity.ok().headers(headers).body(page.getContent());
  }

  /**
   * {@code GET  /players/:id} : get the "id" player.
   *
   * @param id the id of the player to retrieve.
   * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the player, or
   *         with status {@code 404 (Not Found)}.
   */
  @GetMapping("/players/{id}")
  public ResponseEntity<Player> getPlayer(@PathVariable Long id) {
    log.debug("REST request to get Player : {}", id);
    Optional<Player> player = playerService.findOne(id);
    return ResponseUtil.wrapOrNotFound(player);
  }

  /**
   * {@code DELETE  /players/:id} : delete the "id" player.
   *
   * @param id the id of the player to delete.
   * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
   */
  @DeleteMapping("/players/{id}")
  public ResponseEntity<Void> deletePlayer(@PathVariable Long id) {
    log.debug("REST request to delete Player : {}", id);
    playerService.delete(id);
    return ResponseEntity.noContent()
        .headers(
            HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
        .build();
  }
}
