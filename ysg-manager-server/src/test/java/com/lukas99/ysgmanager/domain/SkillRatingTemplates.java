package com.lukas99.ysgmanager.domain;

import java.math.BigDecimal;

public class SkillRatingTemplates {

  public static final BigDecimal NINTY = new BigDecimal("90.00");
  public static final BigDecimal EIGHTY = new BigDecimal("80.00");

  public static SkillRating magicTransitionsRating(Skill skill, Player player) {
    return SkillRating.builder().skill(skill).player(player).score(NINTY).build();
  }

  public static SkillRating controlledJumbleRating(Skill skill, Player player) {
    return SkillRating.builder().skill(skill).player(player).score(EIGHTY).build();
  }

}
