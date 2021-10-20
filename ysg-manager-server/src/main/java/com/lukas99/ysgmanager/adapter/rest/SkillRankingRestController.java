package com.lukas99.ysgmanager.adapter.rest;

import com.lukas99.ysgmanager.domain.SkillRanking;
import com.lukas99.ysgmanager.domain.SkillRankingService;
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
 * REST controller for managing {@link SkillRanking}.
 */
@RestController
@RequestMapping("/api")
public class SkillRankingRestController {

  private final SkillRankingService skillRankingService;
  private final TournamentService tournamentService;

  public SkillRankingRestController(SkillRankingService skillRankingService,
      TournamentService tournamentService) {
    this.skillRankingService = skillRankingService;
    this.tournamentService = tournamentService;
  }

  /**
   * Get all skill rankings of the given tournament
   *
   * @param tournamentId the id of the tournament for which the rankings should be retrieved
   * @return the list of skill rankings.
   */
  @GetMapping("/tournaments/{tournamentId}/skill-rankings")
  public ResponseEntity<CollectionModel<SkillRankingModel>> getSkillRankings(
      @PathVariable Long tournamentId) {
    Optional<Tournament> tournament = tournamentService.findOne(tournamentId);
    List<SkillRanking> rankings = tournament.map(skillRankingService::findByTournament)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    return ResponseEntity.ok(new SkillRankingModelAssembler().toCollectionModel(rankings));
  }

  /**
   * Get the skill ranking with the given id.
   *
   * @param id the id of the skill ranking to retrieve.
   * @return the skill ranking.
   */
  @GetMapping("/skill-rankings/{id}")
  public ResponseEntity<SkillRankingModel> getSkillRanking(@PathVariable Long id) {
    SkillRanking ranking = skillRankingService.findOne(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    return ResponseEntity.ok(new SkillRankingModelAssembler().toModel(ranking));
  }

}
