package com.lukas99.ysgmanager.adapter.rest;

import com.lukas99.ysgmanager.domain.Team;
import com.lukas99.ysgmanager.domain.Tournament;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.hateoas.RepresentationModel;

/**
 * The model for a team used by the REST controllers.
 */
@Getter
@Setter
public class TeamModel extends RepresentationModel<TeamModel> {

  private Long id;

  @NotNull
  private String name;

  private byte[] logo;

  /**
   * Creates an entity of this model.
   *
   * @param tournament The tournament to which the team belongs.
   * @return The created entity.
   */
  public Team toEntity(Tournament tournament) {
    var team = new Team();
    team.setName(getName());
    team.setLogo(getLogo());
    team.setTournament(tournament);
    return team;
  }

}
