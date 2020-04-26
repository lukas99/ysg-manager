package com.lukas99.ysgmanager.domain;

public class SkillResultTemplates {

  public static final Integer THIRTY_SECONDS = 30_000;
  public static final Integer ONE = 1;

  public static final Integer SIX = 2;

  public static SkillResult magicTransitionsResult(Skill skill, Player player) {
    return SkillResult.builder().skill(skill).player(player).time(THIRTY_SECONDS).failures(ONE)
        .build();
  }

  public static SkillResult bestShotResult(Skill skill, Player player) {
    return SkillResult.builder().skill(skill).player(player).points(SIX).build();
  }

}
