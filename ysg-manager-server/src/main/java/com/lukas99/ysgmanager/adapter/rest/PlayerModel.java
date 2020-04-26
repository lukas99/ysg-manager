package com.lukas99.ysgmanager.adapter.rest;

import com.lukas99.ysgmanager.domain.Player;
import com.lukas99.ysgmanager.domain.PlayerPosition;
import com.lukas99.ysgmanager.domain.Team;
import javax.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.hateoas.RepresentationModel;

/**
 * The model for a player used by the REST controllers.
 */
@Getter
@Setter
public class PlayerModel extends RepresentationModel<PlayerModel> {

  private String firstName;

  private String lastName;

  @NotNull
  private Integer shirtNumber;

  @NotNull
  private PlayerPosition position;

  /**
   * Creates an entity of this model.
   *
   * @param team The team to which the player belongs.
   * @return The created entity.
   */
  public Player toEntity(Team team) {
    var player = new Player();
    player.setFirstName(getFirstName());
    player.setLastName(getLastName());
    player.setShirtNumber(getShirtNumber());
    player.setPosition(getPosition());
    player.setTeam(team);
    return player;
  }

}
