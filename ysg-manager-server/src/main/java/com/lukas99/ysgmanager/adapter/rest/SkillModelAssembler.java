package com.lukas99.ysgmanager.adapter.rest;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import com.lukas99.ysgmanager.domain.Skill;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;

/**
 * Assembles a skill model.
 */
public class SkillModelAssembler extends RepresentationModelAssemblerSupport<Skill, SkillModel> {

  public SkillModelAssembler() {
    super(SkillRestController.class, SkillModel.class);
  }

  @Override
  public SkillModel toModel(Skill skill) {
    SkillModel model = instantiateModel(skill);

    model.setTypeForPlayers(skill.getTypeForPlayers());
    model.setTypeForGoaltenders(skill.getTypeForGoaltenders());
    model.setTournamentRankingPlayerPosition(skill.getTournamentRankingPlayerPosition());
    model.setName(skill.getName());
    model.setNumber(skill.getNumber());

    model.add(linkTo(
        methodOn(SkillRestController.class).getSkill(skill.getId()))
        .withSelfRel());
    model.add(linkTo(
        methodOn(TournamentRestController.class).getTournament(skill.getTournament().getId()))
        .withRel("tournament"));
    model.add(linkTo(
        methodOn(SkillResultRestController.class).getSkillResultsBySkill(skill.getId()))
        .withRel("skillresults"));
    model.add(linkTo(
        methodOn(SkillRatingRestController.class).getSkillRatingsBySkill(skill.getId()))
        .withRel("skillratings"));

    return model;
  }

}
