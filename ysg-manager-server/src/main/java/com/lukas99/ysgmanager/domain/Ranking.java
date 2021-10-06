package com.lukas99.ysgmanager.domain;

/**
 * A ranking of a skill.
 */
public interface Ranking {

  Skill getSkill();

  Player getPlayer();

  Integer getRank();

  Integer getSequence();

}
