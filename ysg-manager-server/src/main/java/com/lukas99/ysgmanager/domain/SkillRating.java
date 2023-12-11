package com.lukas99.ysgmanager.domain;

import jakarta.persistence.GenerationType;
import jakarta.persistence.SequenceGenerator;
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
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "hibernate_sequence")
  @SequenceGenerator(name = "hibernate_sequence", allocationSize = 1)
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
