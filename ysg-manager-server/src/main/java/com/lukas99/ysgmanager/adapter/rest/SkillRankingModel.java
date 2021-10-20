package com.lukas99.ysgmanager.adapter.rest;

import javax.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.hateoas.RepresentationModel;

/**
 * The model for a skill ranking used by the REST controllers.
 */
@Getter
@Setter
public class SkillRankingModel extends RepresentationModel<SkillRankingModel> {

  @NotNull
  private Integer rank;

  @NotNull
  private Integer sequence;

  @NotNull
  private SkillModel skill;

  @NotNull
  private PlayerModel player;

}
