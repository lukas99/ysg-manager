package com.lukas99.ysgmanager.domain;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The result of a player for a skill execution.
 */
@Entity
@Table(name = "skillresult")
@Data
@Builder(toBuilder = true)
@EqualsAndHashCode(callSuper = false)
public class SkillResult extends Auditable {

  @Id
  @GeneratedValue
  private Long id;

  @NotNull
  @ManyToOne
  private Skill skill;

  @NotNull
  @ManyToOne
  private Player player;

  /**
   * The execution time as milliseconds.
   */
  private Integer time;

  /**
   * The amount of failures made during execution.
   */
  private Integer failures;

  /**
   * The amount of points achieved during execution.
   */
  private Integer points;

  public void update(SkillResult skillResult) {
    skill = skillResult.getSkill();
    player = skillResult.getPlayer();
    time = skillResult.getTime();
    failures = skillResult.getFailures();
    points = skillResult.getPoints();
  }

}
