package com.lukas99.ysgmanager.adapter.rest;

import com.lukas99.ysgmanager.domain.Skill;
import com.lukas99.ysgmanager.domain.SkillService;
import com.lukas99.ysgmanager.domain.Tournament;
import com.lukas99.ysgmanager.domain.TournamentService;
import java.util.List;
import java.util.Optional;
import jakarta.validation.Valid;
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
 * REST controller for managing {@link com.lukas99.ysgmanager.domain.Skill}.
 */
@RestController
@RequestMapping("/api")
public class SkillRestController {

  private final SkillService skillService;
  private final TournamentService tournamentService;

  public SkillRestController(SkillService skillService, TournamentService tournamentService) {
    this.skillService = skillService;
    this.tournamentService = tournamentService;
  }

  /**
   * Create a new skill.
   *
   * @param tournamentId the id of the tournament for which the skill should be created
   * @param skillModel   the skill to create.
   * @return the created skill
   */
  @PostMapping("/tournaments/{tournamentId}/skills")
  public ResponseEntity<SkillModel> createSkill(
      @PathVariable Long tournamentId, @Valid @RequestBody SkillModel skillModel) {
    Optional<Tournament> tournament = tournamentService.findOne(tournamentId);
    Skill skill = tournament.map(t -> skillModel.toEntity(t))
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    skill = skillService.save(skill);
    return ResponseEntity.ok(new SkillModelAssembler().toModel(skill));
  }

  /**
   * Updates an existing skill.
   *
   * @param id    the id of the skill to update.
   * @param skill the skill to update.
   * @return the the updated skill.
   */
  @PutMapping("/skills/{id}")
  public ResponseEntity<SkillModel> updateSkill(
      @PathVariable Long id, @Valid @RequestBody SkillModel skill) {
    Skill existingSkill = skillService.findOne(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    existingSkill.update(skill.toEntity(existingSkill.getTournament()));
    Skill result = skillService.save(existingSkill);
    return ResponseEntity.ok(new SkillModelAssembler().toModel(result));
  }

  /**
   * Get all skills of the given tournament
   *
   * @param tournamentId the id of the tournament for which the skills should be retrieved
   * @return the list of skills.
   */
  @GetMapping("/tournaments/{tournamentId}/skills")
  public ResponseEntity<CollectionModel<SkillModel>> getSkills(@PathVariable Long tournamentId) {
    Optional<Tournament> tournament = tournamentService.findOne(tournamentId);
    List<Skill> skills = tournament.map(t -> skillService.findByTournament(t))
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    return ResponseEntity.ok(new SkillModelAssembler().toCollectionModel(skills));
  }

  /**
   * Get the skill with the given id.
   *
   * @param id the id of the skill to retrieve.
   * @return the skill.
   */
  @GetMapping("/skills/{id}")
  public ResponseEntity<SkillModel> getSkill(@PathVariable Long id) {
    Skill skill = skillService.findOne(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    return ResponseEntity.ok(new SkillModelAssembler().toModel(skill));
  }

  /**
   * Delete the skill with the given id.
   *
   * @param id the id of the skill to delete.
   * @return no content.
   */
  @DeleteMapping("/skills/{id}")
  public ResponseEntity<Void> deleteSkill(@PathVariable Long id) {
    Skill skill = skillService.findOne(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    skillService.delete(skill.getId());
    return ResponseEntity.noContent().build();
  }

  /**
   * Get all skills of the given tournament
   *
   * @param tournamentId the id of the tournament for which the skills should be retrieved
   * @return accepted.
   */
  @PostMapping("/tournaments/{tournamentId}/skills/calculate-rankings")
  public ResponseEntity<Void> calculateSkillRankings(@PathVariable Long tournamentId) {
    Tournament tournament = tournamentService.findOne(tournamentId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    skillService.calculateSkillRankingsAsync(tournament);
    return ResponseEntity.accepted().build();
  }

}
