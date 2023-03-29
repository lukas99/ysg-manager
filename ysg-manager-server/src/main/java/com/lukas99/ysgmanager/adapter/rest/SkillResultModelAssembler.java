package com.lukas99.ysgmanager.adapter.rest;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import com.lukas99.ysgmanager.domain.SkillResult;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;

/**
 * Assembles a skillResult model.
 */
public class SkillResultModelAssembler extends
    RepresentationModelAssemblerSupport<SkillResult, SkillResultModel> {

  public SkillResultModelAssembler() {
    super(SkillResultRestController.class, SkillResultModel.class);
  }

  @Override
  public SkillResultModel toModel(SkillResult skillResult) {
    SkillResultModel model = instantiateModel(skillResult);

    model.setId(skillResult.getId());
    model.setTime(skillResult.getTime());
    model.setFailures(skillResult.getFailures());
    model.setPoints(skillResult.getPoints());
    model.setPlayer(new PlayerModelAssembler().toModel(skillResult.getPlayer()));

    model.add(linkTo(
        methodOn(SkillResultRestController.class).getSkillResult(skillResult.getId()))
        .withSelfRel());
    model.add(linkTo(
        methodOn(PlayerRestController.class).getPlayer(skillResult.getPlayer().getId()))
        .withRel("player"));
    model.add(linkTo(
        methodOn(SkillRestController.class).getSkill(skillResult.getSkill().getId()))
        .withRel("skill"));

    return model;
  }

}
