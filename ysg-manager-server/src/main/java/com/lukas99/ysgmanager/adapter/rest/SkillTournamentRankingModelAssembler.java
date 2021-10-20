package com.lukas99.ysgmanager.adapter.rest;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import com.lukas99.ysgmanager.domain.SkillTournamentRanking;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;

/**
 * Assembles a skillTournamentRanking model.
 */
public class SkillTournamentRankingModelAssembler extends
    RepresentationModelAssemblerSupport<SkillTournamentRanking, SkillTournamentRankingModel> {

  public SkillTournamentRankingModelAssembler() {
    super(SkillTournamentRankingRestController.class, SkillTournamentRankingModel.class);
  }

  @Override
  public SkillTournamentRankingModel toModel(SkillTournamentRanking skillTournamentRanking) {
    SkillTournamentRankingModel model = instantiateModel(skillTournamentRanking);

    model.setRank(skillTournamentRanking.getRank());
    model.setSequence(skillTournamentRanking.getSequence());
    model.setSkill(new SkillModelAssembler().toModel(skillTournamentRanking.getSkill()));
    model.setPlayer(new PlayerModelAssembler().toModel(skillTournamentRanking.getPlayer()));

    model.add(linkTo(
        methodOn(SkillTournamentRankingRestController.class)
            .getSkillTournamentRanking(skillTournamentRanking.getId()))
        .withSelfRel());
    model.add(linkTo(
        methodOn(PlayerRestController.class).getPlayer(skillTournamentRanking.getPlayer().getId()))
        .withRel("player"));
    model.add(linkTo(
        methodOn(SkillRestController.class).getSkill(skillTournamentRanking.getSkill().getId()))
        .withRel("skill"));

    return model;
  }

}
