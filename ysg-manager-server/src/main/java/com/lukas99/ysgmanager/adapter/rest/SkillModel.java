package com.lukas99.ysgmanager.adapter.rest;

import com.lukas99.ysgmanager.domain.PlayerPosition;
import com.lukas99.ysgmanager.domain.Skill;
import com.lukas99.ysgmanager.domain.SkillType;
import com.lukas99.ysgmanager.domain.Tournament;
import javax.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.hateoas.RepresentationModel;

/**
 * The model for a skill used by the REST controllers.
 */
@Getter
@Setter
public class SkillModel extends RepresentationModel<SkillModel> {

  @NotNull
  private SkillType typeForPlayers;

  @NotNull
  private SkillType typeForGoaltenders;

  @NotNull
  private PlayerPosition tournamentRankingPlayerPosition;

  @NotNull
  private String name;

  private Integer number;

  /**
   * Creates an entity of this model.
   *
   * @param tournament The tournament to which the skill belongs.
   * @return The created entity.
   */
  public Skill toEntity(Tournament tournament) {
    var skill = new Skill();
    skill.setTypeForPlayers(getTypeForPlayers());
    skill.setTypeForGoaltenders(getTypeForGoaltenders());
    skill.setTournamentRankingPlayerPosition(getTournamentRankingPlayerPosition());
    skill.setName(getName());
    skill.setNumber(getNumber());
    skill.setTournament(tournament);
    return skill;
  }

}
