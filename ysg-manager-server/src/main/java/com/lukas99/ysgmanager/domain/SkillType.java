package com.lukas99.ysgmanager.domain;

/**
 * The possible skill types.
 */
public enum SkillType {

  /**
   * Results with time and rated by an skill expert.
   * <p>
   * E.g. YSG skill no. 1 'Magic Transitions' and YSG skill no. 5 'Hit the Road'.
   */
  TIME_WITH_RATING,

  /**
   * Results with time and points.
   * <p>
   * E.g. YSG skill no. 3 'Pass and Go'.
   */
  TIME_WITH_POINTS,

  /**
   * Results with time.
   * <p>
   * E.g. YSG skill no. 4 'Controlled Jumble'.
   */
  TIME,

  /**
   * Results with points.
   * <p>
   * E.g. YSG skill no. 2 'Best Shot'.
   */
  POINTS,

  /**
   * Results with rating.
   * <p>
   * E.g. YSG skill no. 4 'Controlled Jumble' for goaltenders.
   */
  RATING,

  /**
   * The goaltenders overall skill.
   */
  GOALTENDERS_OVERALL,

  /**
   * In case no results will be recorded for a skill.
   *
   * E.g. YSG goaltenders overall skill where no player results will be recorded.
   */
  NO_RESULTS

}
