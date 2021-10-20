package com.lukas99.ysgmanager.adapter.rest;

import javax.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.hateoas.RepresentationModel;

/**
 * The model for a skill tournament ranking used by the REST controllers.
 */
@Getter
@Setter
public class SkillTournamentRankingModel extends RepresentationModel<SkillTournamentRankingModel> {

  @NotNull
  private Integer rank;

  @NotNull
  private Integer sequence;

  @NotNull
  private SkillModel skill;

  @NotNull
  private PlayerModel player;

}
