package com.lukas99.ysgmanager.adapter.rest;

import com.lukas99.ysgmanager.domain.Tournament;
import com.lukas99.ysgmanager.domain.TournamentService;
import java.util.List;
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
 * REST controller for managing {@link com.lukas99.ysgmanager.domain.Tournament}.
 */
@RestController
@RequestMapping("/api")
public class TournamentRestController {

  private final TournamentService tournamentService;

  public TournamentRestController(TournamentService tournamentService) {
    this.tournamentService = tournamentService;
  }

  /**
   * Create a new tournament.
   *
   * @param tournament the tournament to create.
   * @return the created tournament.
   */
  @PostMapping("/tournaments")
  public ResponseEntity<TournamentModel> createTournament(
      @Valid @RequestBody TournamentModel tournament) {
    Tournament result = tournamentService.save(tournament.toEntity());
    return ResponseEntity.ok(new TournamentModelAssembler().toModel(result));
  }

  /**
   * Updates an existing tournament.
   *
   * @param id         the id of the tournament to update.
   * @param tournament the tournament to update.
   * @return the updated tournament
   */
  @PutMapping("/tournaments/{id}")
  public ResponseEntity<TournamentModel> updateTournament(@PathVariable Long id,
      @Valid @RequestBody TournamentModel tournament) {
    Tournament existingTournament = tournamentService.findOne(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    existingTournament.update(tournament.toEntity());
    Tournament result = tournamentService.save(existingTournament);
    return ResponseEntity.ok(new TournamentModelAssembler().toModel(result));
  }

  /**
   * Get all tournaments.
   *
   * @return list of tournaments.
   */
  @GetMapping("/tournaments")
  public ResponseEntity<CollectionModel<TournamentModel>> getAllTournaments() {
    List<Tournament> tournaments = tournamentService.findAll();
    return ResponseEntity.ok(new TournamentModelAssembler().toCollectionModel(tournaments));
  }

  /**
   * Get the tournament with the given id.
   *
   * @param id the id of the tournament to retrieve.
   * @return the tournament.
   */
  @GetMapping("/tournaments/{id}")
  public ResponseEntity<TournamentModel> getTournament(@PathVariable Long id) {
    Tournament tournament = tournamentService.findOne(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    return ResponseEntity.ok(new TournamentModelAssembler().toModel(tournament));
  }

  /**
   * Delete the tournament with the given id.
   *
   * @param id the id of the tournament to delete.
   * @return no content.
   */
  @DeleteMapping("/tournaments/{id}")
  public ResponseEntity<Void> deleteTournament(@PathVariable Long id) {
    Tournament tournament = tournamentService.findOne(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    tournamentService.delete(tournament.getId());
    return ResponseEntity.noContent().build();
  }

}
