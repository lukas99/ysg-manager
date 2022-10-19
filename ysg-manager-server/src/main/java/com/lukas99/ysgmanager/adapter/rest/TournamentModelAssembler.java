package com.lukas99.ysgmanager.adapter.rest;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import com.lukas99.ysgmanager.domain.Tournament;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;

/**
 * Assembles a tournament model.
 */
public class TournamentModelAssembler
    extends RepresentationModelAssemblerSupport<Tournament, TournamentModel> {

  public TournamentModelAssembler() {
    super(TournamentRestController.class, TournamentModel.class);
  }

  @Override
  public TournamentModel toModel(Tournament tournament) {
    TournamentModel model = instantiateModel(tournament);

    model.setName(tournament.getName());
    model.setDateDescription(tournament.getDateDescription());
    model.setActive(tournament.isActive());

    model.add(
        linkTo(methodOn(TournamentRestController.class).getTournament(tournament.getId()))
            .withSelfRel());
    model.add(
        linkTo(methodOn(TeamRestController.class).getTeams(tournament.getId()))
            .withRel("teams"));
    model.add(
        linkTo(methodOn(SkillRestController.class).getSkills(tournament.getId()))
            .withRel("skills"));
    model.add(
        linkTo(methodOn(SkillRestController.class).calculateSkillRankings(tournament.getId()))
            .withRel("calculateskillrankings"));
    model.add(
        linkTo(methodOn(SkillRankingRestController.class).getSkillRankings(tournament.getId()))
            .withRel("skillrankings"));
    model.add(
        linkTo(
            methodOn(SkillTournamentRankingRestController.class)
                .getSkillTournamentRankings(tournament.getId()))
            .withRel("skilltournamentrankings"));

    return model;
  }

}
