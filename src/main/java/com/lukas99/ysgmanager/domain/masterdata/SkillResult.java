package com.lukas99.ysgmanager.domain.masterdata;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The result of a player for a skill execution.
 */
@Entity
@Table
@Data
@EqualsAndHashCode(callSuper = false)
public class SkillResult extends Auditable {

  @Id
  private Long id;

  @ManyToOne
  private Skill skill;

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

}
