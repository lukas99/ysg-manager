package com.lukas99.ysgmanager.adapter.rest;

import static java.util.Objects.nonNull;

import com.lukas99.ysgmanager.domain.Player;
import com.lukas99.ysgmanager.domain.PlayerService;
import com.lukas99.ysgmanager.domain.Skill;
import com.lukas99.ysgmanager.domain.SkillResult;
import com.lukas99.ysgmanager.domain.SkillResultService;
import com.lukas99.ysgmanager.domain.SkillService;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/**
 * REST controller for managing {@link com.lukas99.ysgmanager.domain.SkillResult}.
 */
@RestController
@RequestMapping("/api")
public class SkillResultRestController {

  private final SkillResultService skillResultService;
  private final PlayerService playerService;
  private final SkillService skillService;
  private final TeamService teamService;

  public SkillResultRestController(SkillResultService skillResultService,
      PlayerService playerService, SkillService skillService, TeamService teamService) {
    this.skillResultService = skillResultService;
    this.playerService = playerService;
    this.skillService = skillService;
    this.teamService = teamService;
  }

  /**
   * Create a new skillResult.
   *
   * @param playerId         the id of the player for which the result should be created.
   * @param skillResultModel the skillResult to create.
   * @return the created skillResult.
   */
  @PostMapping("/players/{playerId}/skill-results")
  public ResponseEntity<SkillResultModel> createSkillResultByPlayer(
      @PathVariable Long playerId, @Valid @RequestBody SkillResultModel skillResultModel) {
    Optional<Player> player = playerService.findOne(playerId);
    Optional<Skill> skill = skillResultModel.getLink("skill")
        .map(skillLink -> RestUtils.getLastPathSegment(skillLink))
        .flatMap(skillId -> skillService.findOne(skillId));
    return createSkillResult(skillResultModel, skill, player);
  }

  /**
   * Create a new skillResult.
   *
   * @param skillId          the id of the skill for which the result should be created.
   * @param skillResultModel the skillResult to create.
   * @return the created skillResult.
   */
  @PostMapping("/skills/{skillId}/skill-results")
  public ResponseEntity<SkillResultModel> createSkillResultBySkill(
      @PathVariable Long skillId, @Valid @RequestBody SkillResultModel skillResultModel) {
    Optional<Skill> skill = skillService.findOne(skillId);
    Optional<Player> player = skillResultModel.getLink("player")
        .map(playerLink -> RestUtils.getLastPathSegment(playerLink))
        .flatMap(playerId -> playerService.findOne(playerId));
    return createSkillResult(skillResultModel, skill, player);
  }

  private ResponseEntity<SkillResultModel> createSkillResult(
      SkillResultModel skillResultModel, Optional<Skill> skill, Optional<Player> player) {
    if (player.isEmpty()) {
      var playerModel = skillResultModel.getPlayer();
      player = playerModel.getTeam().getLink("self")
          .map(teamLink -> RestUtils.getLastPathSegment(teamLink))
          .flatMap(teamId -> teamService.findOne(teamId))
          .map(team ->
              playerService.findByShirtNumberAndTeam(playerModel.getShirtNumber(), team)
                  .orElseGet(() -> playerService.save(playerModel.toEntity(team))));
    }
    if (player.isPresent() && skill.isPresent()) {
      SkillResult skillResult = skillResultModel.toEntity(player.get(), skill.get());
      skillResult = skillResultService.save(skillResult);
      return ResponseEntity.ok(new SkillResultModelAssembler().toModel(skillResult));
    } else {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }
  }

  /**
   * Updates an existing skillResult.
   *
   * @param id          the id of the skillResult to update.
   * @param skillResult the skillResult to update.
   * @return the updated skillResult.
   */
  @PutMapping("/skill-results/{id}")
  public ResponseEntity<SkillResultModel> updateSkillResult(
      @PathVariable Long id, @Valid @RequestBody SkillResultModel skillResult) {
    SkillResult existingSkillResult = skillResultService.findOne(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    existingSkillResult.update(
        skillResult.toEntity(existingSkillResult.getPlayer(), existingSkillResult.getSkill()));
    SkillResult result = skillResultService.save(existingSkillResult);
    return ResponseEntity.ok(new SkillResultModelAssembler().toModel(result));
  }

  /**
   * Get all skillResults of the given skill. Optional filtered by team and player shirt number.
   *
   * @param skillId           the id of the skill for which the results should be retrieved
   * @param teamId            the id of the team for which the results should be retrieved
   * @param playerShirtNumber the shirt number of the player for which the results should be
   *                          retrieved
   * @return the list of results.
   */
  @GetMapping("/skills/{skillId}/skill-results")
  public ResponseEntity<CollectionModel<SkillResultModel>> getSkillResultsBySkill(
      @PathVariable Long skillId, @RequestParam(required = false) Long teamId,
      @RequestParam(required = false) Integer playerShirtNumber) {
    List<SkillResult> skillResults;
    Optional<Skill> skillOpt = skillService.findOne(skillId);
    if (nonNull(teamId) && nonNull(playerShirtNumber)) {
      Optional<Team> teamOpt = teamService.findOne(teamId);
      skillResults = skillOpt
          .map(skill -> teamOpt.map(team -> skillResultService
                  .findBySkillAndTeamAndPlayerShirtNumber(skill, team, playerShirtNumber))
              .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND)))
          .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    } else if (nonNull(teamId)) {
      Optional<Team> teamOpt = teamService.findOne(teamId);
      skillResults = skillOpt
          .map(skill ->
              teamOpt.map(team -> skillResultService.findBySkillAndTeam(skill, team))
                  .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND)))
          .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    } else {
      skillResults = skillOpt
          .map(skillResultService::findBySkill)
          .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }
    return ResponseEntity.ok(new SkillResultModelAssembler().toCollectionModel(skillResults));
  }

  /**
   * Get all skillResults of the given player.
   *
   * @param playerId the id of the player for which the results should be retrieved
   * @return the list of results.
   */
  @GetMapping("/players/{playerId}/skill-results")
  public ResponseEntity<CollectionModel<SkillResultModel>> getSkillResultsByPlayer(
      @PathVariable Long playerId) {
    Optional<Player> player = playerService.findOne(playerId);
    List<SkillResult> skillResults = player.map(sr -> skillResultService.findByPlayer(sr))
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    return ResponseEntity.ok(new SkillResultModelAssembler().toCollectionModel(skillResults));
  }

  /**
   * Get the skillResult with the given id.
   *
   * @param id the id of the skillResult to retrieve.
   * @return the skillResult.
   */
  @GetMapping("/skill-results/{id}")
  public ResponseEntity<SkillResultModel> getSkillResult(@PathVariable Long id) {
    SkillResult skillResult = skillResultService.findOne(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    return ResponseEntity.ok(new SkillResultModelAssembler().toModel(skillResult));
  }

  /**
   * Delete the skillResult with the given id.
   *
   * @param id the id of the skillResult to delete.
   * @return no content.
   */
  @DeleteMapping("/skill-results/{id}")
  public ResponseEntity<Void> deleteSkillResult(@PathVariable Long id) {
    SkillResult skillResult = skillResultService.findOne(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    skillResultService.delete(skillResult.getId());
    return ResponseEntity.noContent().build();
  }

}
