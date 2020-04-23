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

    model.setSkillType(skill.getSkillType());
    model.setName(skill.getName());
    model.setNumber(skill.getNumber());

    model.add(linkTo(
        methodOn(SkillRestController.class).getSkill(skill.getId()))
        .withSelfRel());
    model.add(linkTo(
        methodOn(TournamentRestController.class).getTournament(skill.getTournament().getId()))
        .withRel("tournament"));

    return model;
  }

}
