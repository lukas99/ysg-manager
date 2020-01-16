package com.lukas99.ysgmanager.domain;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The rating of a player for a skill provided by a skill expert.
 */
@Entity
@Table(name = "skillrating")
@Data
@EqualsAndHashCode(callSuper = false)
public class SkillRating extends Auditable {

  @Id
  private Long id;

  @ManyToOne
  private Skill skill;

  @ManyToOne
  private Player player;

  /**
   * The score given by a skill expert.
   */
  private Integer score;

}
