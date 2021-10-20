package com.lukas99.ysgmanager.adapter.rest;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import com.lukas99.ysgmanager.domain.SkillRanking;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;

/**
 * Assembles a skillRanking model.
 */
public class SkillRankingModelAssembler extends
    RepresentationModelAssemblerSupport<SkillRanking, SkillRankingModel> {

  public SkillRankingModelAssembler() {
    super(SkillRankingRestController.class, SkillRankingModel.class);
  }

  @Override
  public SkillRankingModel toModel(SkillRanking skillRanking) {
    SkillRankingModel model = instantiateModel(skillRanking);

    model.setRank(skillRanking.getRank());
    model.setSequence(skillRanking.getSequence());
    model.setSkill(new SkillModelAssembler().toModel(skillRanking.getSkill()));
    model.setPlayer(new PlayerModelAssembler().toModel(skillRanking.getPlayer()));

    model.add(linkTo(
        methodOn(SkillRankingRestController.class).getSkillRanking(skillRanking.getId()))
        .withSelfRel());
    model.add(linkTo(
        methodOn(PlayerRestController.class).getPlayer(skillRanking.getPlayer().getId()))
        .withRel("player"));
    model.add(linkTo(
        methodOn(SkillRestController.class).getSkill(skillRanking.getSkill().getId()))
        .withRel("skill"));

    return model;
  }

}
