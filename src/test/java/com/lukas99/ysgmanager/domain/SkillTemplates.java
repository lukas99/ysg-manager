package com.lukas99.ysgmanager.domain;

public class SkillTemplates {

  public static final String MAGIC_TRANSITIONS = "Magic Transitions";
  public static final Integer ONE = 1;

  public static final String BEST_SHOT = "Best Shot";
  public static final Integer TWO = 2;

  public static Skill magicTransitions(Tournament tournament) {
    return Skill.builder().name(MAGIC_TRANSITIONS).skillType(SkillType.TIME_WITH_RATING).number(ONE)
        .tournament(tournament).build();
  }

  public static Skill bestShot(Tournament tournament) {
    return Skill.builder().name(BEST_SHOT).skillType(SkillType.POINTS).number(TWO)
        .tournament(tournament).build();
  }

}
