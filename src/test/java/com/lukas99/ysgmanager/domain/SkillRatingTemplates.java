package com.lukas99.ysgmanager.domain;

public class SkillRatingTemplates {

  public static final Integer NINTY = 90;
  public static final Integer EIGHTY = 80;

  public static SkillRating magicTransitionsRating(Skill skill, Player player) {
    return SkillRating.builder().skill(skill).player(player).score(NINTY).build();
  }

  public static SkillRating controlledJumbleRating(Skill skill, Player player) {
    return SkillRating.builder().skill(skill).player(player).score(EIGHTY).build();
  }

}
