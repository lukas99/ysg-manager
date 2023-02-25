package com.lukas99.ysgmanager.domain;

import jakarta.persistence.EntityManager;

public class SkillTemplates {

  public static final String MAGIC_TRANSITIONS = "Magic Transitions";
  public static final Integer ONE = 1;

  public static final String BEST_SHOT = "Best Shot";
  public static final Integer TWO = 2;

  public static final String PASS_AND_GO = "Pass and Go";
  public static final Integer THREE = 3;

  public static final String CONTROLLED_JUMBLE = "Controlled Jumble";
  public static final Integer FOUR = 4;

  public static final String HIT_THE_ROAD = "Hit the Road";
  public static final Integer FIVE = 5;

  public static final String GOALTENDERS = "Torhüter";
  public static final Integer SIX = 6;

  public static Skill magicTransitions(Tournament tournament) {
    return Skill.builder().name(MAGIC_TRANSITIONS).number(ONE)
        .typeForPlayers(SkillType.TIME_WITH_RATING)
        .typeForGoaltenders(SkillType.TIME_WITH_RATING)
        .tournamentRankingPlayerPosition(PlayerPosition.SKATER)
        .tournament(tournament).build();
  }

  public static Skill magicTransitions(Tournament tournament, EntityManager em) {
    return persist(magicTransitions(tournament), em);
  }

  public static Skill bestShot(Tournament tournament) {
    return Skill.builder().name(BEST_SHOT).number(TWO)
        .typeForPlayers(SkillType.POINTS)
        .typeForGoaltenders(SkillType.POINTS)
        .tournamentRankingPlayerPosition(PlayerPosition.SKATER)
        .tournament(tournament).build();
  }

  public static Skill bestShot(Tournament tournament, EntityManager em) {
    return persist(bestShot(tournament), em);
  }

  public static Skill passAndGo(Tournament tournament) {
    return Skill.builder().name(PASS_AND_GO).number(THREE)
        .typeForPlayers(SkillType.TIME_WITH_POINTS)
        .typeForGoaltenders(SkillType.TIME_WITH_POINTS)
        .tournamentRankingPlayerPosition(PlayerPosition.SKATER)
        .tournament(tournament).build();
  }

  public static Skill passAndGo(Tournament tournament, EntityManager em) {
    return persist(passAndGo(tournament), em);
  }

  public static Skill controlledJumble(Tournament tournament) {
    return Skill.builder().name(CONTROLLED_JUMBLE).number(FOUR)
        .typeForPlayers(SkillType.TIME)
        .typeForGoaltenders(SkillType.RATING)
        .tournamentRankingPlayerPosition(PlayerPosition.SKATER)
        .tournament(tournament).build();
  }

  public static Skill controlledJumble(Tournament tournament, EntityManager em) {
    return persist(controlledJumble(tournament), em);
  }

  public static Skill hitTheRoad(Tournament tournament) {
    return Skill.builder().name(HIT_THE_ROAD).number(FIVE)
        .typeForPlayers(SkillType.TIME_WITH_RATING)
        .typeForGoaltenders(SkillType.RATING)
        .tournamentRankingPlayerPosition(PlayerPosition.SKATER)
        .tournament(tournament).build();
  }

  public static Skill hitTheRoad(Tournament tournament, EntityManager em) {
    return persist(hitTheRoad(tournament), em);
  }

  public static Skill goaltenders(Tournament tournament) {
    return Skill.builder().name(GOALTENDERS).number(SIX)
        .typeForPlayers(SkillType.NO_RESULTS)
        .typeForGoaltenders(SkillType.GOALTENDERS_OVERALL)
        .tournamentRankingPlayerPosition(PlayerPosition.GOALTENDER)
        .tournament(tournament).build();
  }

  public static Skill goaltenders(Tournament tournament, EntityManager em) {
    return persist(goaltenders(tournament), em);
  }

  private static Skill persist(Skill bestShot, EntityManager em) {
    em.persist(bestShot);
    return bestShot;
  }

}
