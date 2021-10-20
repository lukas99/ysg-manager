package com.lukas99.ysgmanager.adapter.rest;

import com.lukas99.ysgmanager.domain.SkillTournamentRanking;
import com.lukas99.ysgmanager.domain.SkillTournamentRankingService;
import com.lukas99.ysgmanager.domain.Tournament;
import com.lukas99.ysgmanager.domain.TournamentService;
import java.util.List;
import java.util.Optional;
import org.springframework.hateoas.CollectionModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/**
 * REST controller for managing {@link SkillTournamentRanking}.
 */
@RestController
@RequestMapping("/api")
public class SkillTournamentRankingRestController {

  private final SkillTournamentRankingService skillTournamentRankingService;
  private final TournamentService tournamentService;

  public SkillTournamentRankingRestController(
      SkillTournamentRankingService skillTournamentRankingService,
      TournamentService tournamentService) {
    this.skillTournamentRankingService = skillTournamentRankingService;
    this.tournamentService = tournamentService;
  }

  /**
   * Get all skill tournament rankings of the given tournament
   *
   * @param tournamentId the id of the tournament for which the rankings should be retrieved
   * @return the list of skill tournament rankings.
   */
  @GetMapping("/tournaments/{tournamentId}/skill-tournament-rankings")
  public ResponseEntity<CollectionModel<SkillTournamentRankingModel>> getSkillTournamentRankings(
      @PathVariable Long tournamentId) {
    Optional<Tournament> tournament = tournamentService.findOne(tournamentId);
    List<SkillTournamentRanking> rankings =
        tournament.map(skillTournamentRankingService::findByTournament)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    return ResponseEntity.ok(
        new SkillTournamentRankingModelAssembler().toCollectionModel(rankings));
  }

  /**
   * Get the skill tournament ranking with the given id.
   *
   * @param id the id of the skill tournament ranking to retrieve.
   * @return the skill tournament ranking.
   */
  @GetMapping("/skill-tournament-rankings/{id}")
  public ResponseEntity<SkillTournamentRankingModel> getSkillTournamentRanking(
      @PathVariable Long id) {
    SkillTournamentRanking ranking = skillTournamentRankingService.findOne(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    return ResponseEntity.ok(new SkillTournamentRankingModelAssembler().toModel(ranking));
  }

}
