package com.lukas99.ysgmanager.domain;

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
 * The ranking of a player for a skill. It's the ranking of a single skill for all players.
 */
@Entity
@Table(name = "skillranking")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@EqualsAndHashCode(callSuper = false)
public class SkillRanking extends Auditable implements Ranking {

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
   * The rank of the player in the skill (two players can have the same rank in the same skill).
   */
  @NotNull
  private Integer rank;

  /**
   * The sequence of the rankings in the skill (two players can NOT have the same sequence in the
   * same skill).
   */
  @NotNull
  private Integer sequence;

}
