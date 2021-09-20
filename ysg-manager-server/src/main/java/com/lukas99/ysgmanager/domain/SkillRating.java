package com.lukas99.ysgmanager.domain;

import java.math.BigDecimal;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * The rating of a player for a skill provided by a skill expert.
 */
@Entity
@Table(name = "skillrating")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@EqualsAndHashCode(callSuper = false)
public class SkillRating extends Auditable {

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
   * The score given by a skill expert.
   */
  @NotNull
  private BigDecimal score;

  public void update(SkillRating skillRating) {
    skill = skillRating.getSkill();
    player = skillRating.getPlayer();
    score = skillRating.getScore();
  }

}
