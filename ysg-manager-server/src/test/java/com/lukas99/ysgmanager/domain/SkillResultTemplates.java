package com.lukas99.ysgmanager.domain;

import java.math.BigDecimal;

public class SkillResultTemplates {

  public static final BigDecimal THIRTY_SECONDS = new BigDecimal("30.00");
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
