package com.lukas99.ysgmanager.adapter.rest;

import com.lukas99.ysgmanager.domain.Player;
import com.lukas99.ysgmanager.domain.PlayerService;
import com.lukas99.ysgmanager.domain.Skill;
import com.lukas99.ysgmanager.domain.SkillRating;
import com.lukas99.ysgmanager.domain.SkillRatingService;
import com.lukas99.ysgmanager.domain.SkillService;
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
 * REST controller for managing {@link com.lukas99.ysgmanager.domain.SkillRating}.
 */
@RestController
@RequestMapping("/api")
public class SkillRatingRestController {

  private final SkillRatingService skillRatingService;
  private final PlayerService playerService;
  private final SkillService skillService;

  public SkillRatingRestController(SkillRatingService skillRatingService,
      PlayerService playerService, SkillService skillService) {
    this.skillRatingService = skillRatingService;
    this.playerService = playerService;
    this.skillService = skillService;
  }

  /**
   * Create a new skillRating.
   *
   * @param playerId         the id of the player for which the rating should be created.
   * @param skillRatingModel the skillRating to create.
   * @return the created skillRating.
   */
  @PostMapping("/players/{playerId}/skill-ratings")
  public ResponseEntity<SkillRatingModel> createSkillRating(
      @PathVariable Long playerId, @Valid @RequestBody SkillRatingModel skillRatingModel) {
    Optional<Player> player = playerService.findOne(playerId);
    Optional<Skill> skill = skillRatingModel.getLink("skill")
        .map(skillLink -> RestUtils.getLastPathSegment(skillLink))
        .flatMap(skillId -> skillService.findOne(skillId));
    if (player.isPresent() && skill.isPresent()) {
      SkillRating skillRating = skillRatingModel.toEntity(player.get(), skill.get());
      skillRating = skillRatingService.save(skillRating);
      return ResponseEntity.ok(new SkillRatingModelAssembler().toModel(skillRating));
    } else {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }
  }

  /**
   * Updates an existing skillRating.
   *
   * @param id          the id of the skillRating to update.
   * @param skillRating the skillRating to update.
   * @return the updated skillRating.
   */
  @PutMapping("/skill-ratings/{id}")
  public ResponseEntity<SkillRatingModel> updateSkillRating(
      @PathVariable Long id, @Valid @RequestBody SkillRatingModel skillRating) {
    SkillRating existingSkillRating = skillRatingService.findOne(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    existingSkillRating.update(
        skillRating.toEntity(existingSkillRating.getPlayer(), existingSkillRating.getSkill()));
    SkillRating result = skillRatingService.save(existingSkillRating);
    return ResponseEntity.ok(new SkillRatingModelAssembler().toModel(result));
  }

  /**
   * Get all skillRatings of the given skill.
   *
   * @param skillId the id of the skill for which the ratings should be retrieved
   * @return the list of ratings.
   */
  @GetMapping("/skills/{skillId}/skill-ratings")
  public ResponseEntity<CollectionModel<SkillRatingModel>> getSkillRatingsBySkill(
      @PathVariable Long skillId) {
    Optional<Skill> skill = skillService.findOne(skillId);
    List<SkillRating> skillRatings = skill.map(sr -> skillRatingService.findBySkill(sr))
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    return ResponseEntity.ok(new SkillRatingModelAssembler().toCollectionModel(skillRatings));
  }

  /**
   * Get all skillRatings of the given player.
   *
   * @param playerId the id of the player for which the ratings should be retrieved
   * @return the list of ratings.
   */
  @GetMapping("/players/{playerId}/skill-ratings")
  public ResponseEntity<CollectionModel<SkillRatingModel>> getSkillRatingsByPlayer(
      @PathVariable Long playerId) {
    Optional<Player> player = playerService.findOne(playerId);
    List<SkillRating> skillRatings = player.map(sr -> skillRatingService.findByPlayer(sr))
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    return ResponseEntity.ok(new SkillRatingModelAssembler().toCollectionModel(skillRatings));
  }

  /**
   * Get the skillRating with the given id.
   *
   * @param id the id of the skillRating to retrieve.
   * @return the skillRating.
   */
  @GetMapping("/skill-ratings/{id}")
  public ResponseEntity<SkillRatingModel> getSkillRating(@PathVariable Long id) {
    SkillRating skillRating = skillRatingService.findOne(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    return ResponseEntity.ok(new SkillRatingModelAssembler().toModel(skillRating));
  }

  /**
   * Delete the skillRating with the given id.
   *
   * @param id the id of the skillRating to delete.
   * @return no content.
   */
  @DeleteMapping("/skill-ratings/{id}")
  public ResponseEntity<Void> deleteSkillRating(@PathVariable Long id) {
    SkillRating skillRating = skillRatingService.findOne(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    skillRatingService.delete(skillRating.getId());
    return ResponseEntity.noContent().build();
  }

}
