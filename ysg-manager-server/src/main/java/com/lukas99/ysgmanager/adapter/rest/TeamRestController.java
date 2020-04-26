package com.lukas99.ysgmanager.adapter.rest;

import com.lukas99.ysgmanager.domain.Team;
import com.lukas99.ysgmanager.domain.TeamService;
import com.lukas99.ysgmanager.domain.Tournament;
import com.lukas99.ysgmanager.domain.TournamentService;
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
 * REST controller for managing {@link com.lukas99.ysgmanager.domain.Team}.
 */
@RestController
@RequestMapping("/api")
public class TeamRestController {

  private final TeamService teamService;
  private final TournamentService tournamentService;

  public TeamRestController(TeamService teamService, TournamentService tournamentService) {
    this.teamService = teamService;
    this.tournamentService = tournamentService;
  }

  /**
   * Create a new team.
   *
   * @param tournamentId the id of the tournament for which the team should be created
   * @param teamModel    the team to create.
   * @return the created team.
   */
  @PostMapping("/tournaments/{tournamentId}/teams")
  public ResponseEntity<TeamModel> createTeam(
      @PathVariable Long tournamentId, @Valid @RequestBody TeamModel teamModel) {
    Optional<Tournament> tournament = tournamentService.findOne(tournamentId);
    Team team = tournament.map(t -> teamModel.toEntity(t))
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    team = teamService.save(team);
    return ResponseEntity.ok(new TeamModelAssembler().toModel(team));
  }

  /**
   * Updates an existing team.
   *
   * @param id the id of the team to update.
   * @param team the team to update.
   * @return the the updated team.
   */
  @PutMapping("/teams/{id}")
  public ResponseEntity<TeamModel> updateTeam(
      @PathVariable Long id, @Valid @RequestBody TeamModel team) {
    Team existingTeam = teamService.findOne(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    existingTeam.update(team.toEntity(existingTeam.getTournament()));
    Team result = teamService.save(existingTeam);
    return ResponseEntity.ok(new TeamModelAssembler().toModel(result));
  }

  /**
   * Get all teams of the given tournament
   *
   * @param tournamentId the id of the tournament for which the teams should be retrieved
   * @return the list of teams.
   */
  @GetMapping("/tournaments/{tournamentId}/teams")
  public ResponseEntity<CollectionModel<TeamModel>> getTeams(@PathVariable Long tournamentId) {
    Optional<Tournament> tournament = tournamentService.findOne(tournamentId);
    List<Team> teams = tournament.map(t -> teamService.findByTournament(t))
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    return ResponseEntity.ok(new TeamModelAssembler().toCollectionModel(teams));
  }

  /**
   * Get the team with the given id.
   *
   * @param id the id of the team to retrieve.
   * @return the team.
   */
  @GetMapping("/teams/{id}")
  public ResponseEntity<TeamModel> getTeam(@PathVariable Long id) {
    Team team = teamService.findOne(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    return ResponseEntity.ok(new TeamModelAssembler().toModel(team));
  }

  /**
   * Delete the team with the given id.
   *
   * @param id the id of the team to delete.
   * @return no content.
   */
  @DeleteMapping("/teams/{id}")
  public ResponseEntity<Void> deleteTeam(@PathVariable Long id) {
    Team team = teamService.findOne(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    teamService.delete(team.getId());
    return ResponseEntity.noContent().build();
  }

}
