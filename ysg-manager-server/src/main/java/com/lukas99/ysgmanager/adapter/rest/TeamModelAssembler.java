package com.lukas99.ysgmanager.adapter.rest;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import com.lukas99.ysgmanager.domain.Team;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;

/**
 * Assembles a team model.
 */
public class TeamModelAssembler extends RepresentationModelAssemblerSupport<Team, TeamModel> {

  public TeamModelAssembler() {
    super(TeamRestController.class, TeamModel.class);
  }

  @Override
  public TeamModel toModel(Team team) {
    var model = instantiateModel(team);

    model.setId(team.getId());
    model.setName(team.getName());
    model.setLogo(team.getLogo());

    model.add(
        linkTo(methodOn(TeamRestController.class).getTeam(team.getId()))
            .withSelfRel());
    model.add(
        linkTo(methodOn(TournamentRestController.class).getTournament(team.getTournament().getId()))
            .withRel("tournament"));
    model.add(
        linkTo(methodOn(PlayerRestController.class).getAllPlayers(team.getId()))
            .withRel("players"));

    return model;
  }

}
