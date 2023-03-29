package com.lukas99.ysgmanager.adapter.rest;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import com.lukas99.ysgmanager.domain.SkillRating;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;

/**
 * Assembles a skillRating model.
 */
public class SkillRatingModelAssembler extends
    RepresentationModelAssemblerSupport<SkillRating, SkillRatingModel> {

  public SkillRatingModelAssembler() {
    super(SkillRatingRestController.class, SkillRatingModel.class);
  }

  @Override
  public SkillRatingModel toModel(SkillRating skillRating) {
    SkillRatingModel model = instantiateModel(skillRating);

    model.setId(skillRating.getId());
    model.setScore(skillRating.getScore());
    model.setPlayer(new PlayerModelAssembler().toModel(skillRating.getPlayer()));

    model.add(linkTo(
        methodOn(SkillRatingRestController.class).getSkillRating(skillRating.getId()))
        .withSelfRel());
    model.add(linkTo(
        methodOn(PlayerRestController.class).getPlayer(skillRating.getPlayer().getId()))
        .withRel("player"));
    model.add(linkTo(
        methodOn(SkillRestController.class).getSkill(skillRating.getSkill().getId()))
        .withRel("skill"));

    return model;
  }

}
