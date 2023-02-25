package com.lukas99.ysgmanager.domain;

import java.math.BigDecimal;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * The result of a player for a skill execution.
 */
@Entity
@Table(name = "skillresult")
@Data
@NoArgsConstructor
@AllArgsConstructor
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
   * The execution time in seconds with maximum 2 numbers after the point.
   */
  private BigDecimal time;

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
