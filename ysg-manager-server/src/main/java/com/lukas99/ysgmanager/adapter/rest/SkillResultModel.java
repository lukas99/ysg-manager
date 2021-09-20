package com.lukas99.ysgmanager.adapter.rest;

import com.lukas99.ysgmanager.domain.Player;
import com.lukas99.ysgmanager.domain.Skill;
import com.lukas99.ysgmanager.domain.SkillResult;
import java.math.BigDecimal;
import lombok.Getter;
import lombok.Setter;
import org.springframework.hateoas.RepresentationModel;

/**
 * The model for a skillResult used by the REST controllers.
 */
@Getter
@Setter
public class SkillResultModel extends RepresentationModel<SkillResultModel> {

  private BigDecimal time;
  private Integer failures;
  private Integer points;
  private PlayerModel player;

  /**
   * Creates an entity of this model.
   *
   * @param player The player to which the result belongs.
   * @param skill  The skill to which the result belongs.
   * @return The created entity.
   */
  public SkillResult toEntity(Player player, Skill skill) {
    var skillResult = new SkillResult();
    skillResult.setTime(getTime());
    skillResult.setFailures(getFailures());
    skillResult.setPoints(getPoints());
    skillResult.setPlayer(player);
    skillResult.setSkill(skill);
    return skillResult;
  }

}
