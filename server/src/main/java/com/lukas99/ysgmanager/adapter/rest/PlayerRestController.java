package com.lukas99.ysgmanager.adapter.rest;

import com.lukas99.ysgmanager.domain.Player;
import com.lukas99.ysgmanager.domain.PlayerService;
import com.lukas99.ysgmanager.domain.Team;
import com.lukas99.ysgmanager.domain.TeamService;
import java.util.List;
import java.util.Optional;
import javax.validation.Valid;
import org.springframework.hateoas.CollectionModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/**
 * REST controller for managing {@link com.lukas99.ysgmanager.domain.Player}.
 */
@RestController
@RequestMapping("/api")
public class PlayerRestController {

  private final PlayerService playerService;
  private final TeamService teamService;

  public PlayerRestController(PlayerService playerService, TeamService teamService) {
    this.playerService = playerService;
    this.teamService = teamService;
  }

  /**
   * Create a new player.
   *
   * @param teamId      the id of the team for which the player should be created.
   * @param playerModel the player to create.
   * @return the created player
   */
  @PostMapping("/teams/{teamId}/players")
  public ResponseEntity<PlayerModel> createPlayer(
      @PathVariable Long teamId, @Valid @RequestBody PlayerModel playerModel) {
    Optional<Team> team = teamService.findOne(teamId);
    Player player = team.map(t -> playerModel.toEntity(t))
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    player = playerService.save(player);
    return ResponseEntity.ok(new PlayerModelAssembler().toModel(player));
  }

  /**
   * Updates an existing player.
   *
   * @param id     the id of the player to update
   * @param player the player to update.
   * @return the updated player.
   */
  @PutMapping("/players/{id}")
  public ResponseEntity<PlayerModel> updatePlayer(
      @PathVariable Long id, @Valid @RequestBody PlayerModel player) {
    Player existingPlayer = playerService.findOne(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    existingPlayer.update(player.toEntity(existingPlayer.getTeam()));
    Player result = playerService.save(existingPlayer);
    return ResponseEntity.ok(new PlayerModelAssembler().toModel(result));
  }

  /**
   * Get all the players of the given team.
   *
   * @param teamId the id of the team for which the players should be retrieved
   * @return the list of players.
   */
  @GetMapping("/teams/{teamId}/players")
  public ResponseEntity<CollectionModel<PlayerModel>> getAllPlayers(@PathVariable Long teamId) {
    Optional<Team> team = teamService.findOne(teamId);
    List<Player> players = team.map(t -> playerService.findByTeam(t))
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    return ResponseEntity.ok(new PlayerModelAssembler().toCollectionModel(players));
  }

  /**
   * Get the player with the given id.
   *
   * @param id the id of the player to retrieve.
   * @return the player.
   */
  @GetMapping("/players/{id}")
  public ResponseEntity<PlayerModel> getPlayer(@PathVariable Long id) {
    Player player = playerService.findOne(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    return ResponseEntity.ok(new PlayerModelAssembler().toModel(player));
  }

  /**
   * Delete the player with the given id.
   *
   * @param id the id of the player to delete.
   * @return no content.
   */
  @DeleteMapping("/players/{id}")
  public ResponseEntity<Void> deletePlayer(@PathVariable Long id) {
    Player player = playerService.findOne(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    playerService.delete(player.getId());
    return ResponseEntity.noContent().build();
  }

}
