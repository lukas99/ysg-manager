package com.lukas99.ysgmanager.adapter.rest;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import com.lukas99.ysgmanager.domain.Player;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;

/**
 * Assembles a player model.
 */
public class PlayerModelAssembler extends RepresentationModelAssemblerSupport<Player, PlayerModel> {

  public PlayerModelAssembler() {
    super(PlayerRestController.class, PlayerModel.class);
  }

  @Override
  public PlayerModel toModel(Player player) {
    var model = instantiateModel(player);

    model.setFirstName(player.getFirstName());
    model.setLastName(player.getLastName());
    model.setShirtNumber(player.getShirtNumber());
    model.setPosition(player.getPosition());

    model.add(
        linkTo(methodOn(PlayerRestController.class).getPlayer(player.getId()))
            .withSelfRel());
    model.add(
        linkTo(methodOn(TeamRestController.class).getTeam(player.getTeam().getId()))
            .withRel("team"));

    return model;
  }

}
