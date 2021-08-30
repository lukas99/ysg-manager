package com.lukas99.ysgmanager.adapter.rest;

import com.lukas99.ysgmanager.domain.Player;
import com.lukas99.ysgmanager.domain.Skill;
import com.lukas99.ysgmanager.domain.SkillRating;
import javax.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.hateoas.RepresentationModel;

/**
 * The model for a skillRating used by the REST controllers.
 */
@Getter
@Setter
public class SkillRatingModel extends RepresentationModel<SkillRatingModel> {

  @NotNull
  private Integer score;

  private PlayerModel player;

  /**
   * Creates an entity of this model.
   *
   * @param player The player to which the rating belongs.
   * @param skill  The skill to which the rating belongs.
   * @return The created entity.
   */
  public SkillRating toEntity(Player player, Skill skill) {
    var skillRating = new SkillRating();
    skillRating.setScore(getScore());
    skillRating.setPlayer(player);
    skillRating.setSkill(skill);
    return skillRating;
  }

}
