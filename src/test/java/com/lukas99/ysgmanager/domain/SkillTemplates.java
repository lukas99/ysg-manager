package com.lukas99.ysgmanager.domain;

import javax.persistence.EntityManager;

public class SkillTemplates {

  public static final String MAGIC_TRANSITIONS = "Magic Transitions";
  public static final Integer ONE = 1;

  public static final String BEST_SHOT = "Best Shot";
  public static final Integer TWO = 2;

  public static final String CONTROLLED_JUMBLE = "Controlled Jumble";
  public static final Integer FOUR = 4;

  public static Skill magicTransitions(Tournament tournament) {
    return Skill.builder().name(MAGIC_TRANSITIONS).skillType(SkillType.TIME_WITH_RATING).number(ONE)
        .tournament(tournament).build();
  }

  public static Skill magicTransitions(Tournament tournament, EntityManager em) {
    Skill magicTransitions = magicTransitions(tournament);
    em.persist(magicTransitions);
    return magicTransitions;
  }

  public static Skill bestShot(Tournament tournament) {
    return Skill.builder().name(BEST_SHOT).skillType(SkillType.POINTS).number(TWO)
        .tournament(tournament).build();
  }

  public static Skill bestShot(Tournament tournament, EntityManager em) {
    Skill bestShot = bestShot(tournament);
    em.persist(bestShot);
    return bestShot;
  }

  public static Skill controlledJumble(Tournament tournament) {
    return Skill.builder().name(CONTROLLED_JUMBLE).skillType(SkillType.TIME).number(FOUR)
        .tournament(tournament).build();
  }

  public static Skill controlledJumble(Tournament tournament, EntityManager em) {
    Skill controlledJumble = controlledJumble(tournament);
    em.persist(controlledJumble);
    return controlledJumble;
  }

}
