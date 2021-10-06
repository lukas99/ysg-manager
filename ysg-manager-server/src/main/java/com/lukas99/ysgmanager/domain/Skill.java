package com.lukas99.ysgmanager.domain;

import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * A skill.
 */
@Entity
@Table
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@EqualsAndHashCode(callSuper = false)
public class Skill extends Auditable {

  @Id
  @GeneratedValue
  private Long id;

  @NotNull
  @Column
  private SkillType typeForPlayers;

  @NotNull
  @Column
  private SkillType typeForGoaltenders;

  /**
   * The players with this position will be included in the tournament ranking of this skill. E.g.
   * when a skill has set type SKATER, then the tournament ranking of this skill will only contain
   * skaters but no goaltenders. Only the tournament skill rankings depend on this setting, but not
   * the skill rankings.
   */
  @NotNull
  @Column
  private PlayerPosition tournamentRankingPlayerPosition;

  @NotNull
  private String name;

  /**
   * The number to order the skills between each others.
   */
  private Integer number;

  @NotNull
  @ManyToOne
  private Tournament tournament;

  @OneToMany(mappedBy = "skill")
  @ToString.Exclude
  private List<SkillRating> ratings;

  @OneToMany(mappedBy = "skill")
  @ToString.Exclude
  private List<SkillResult> results;

  public void update(Skill skill) {
    typeForPlayers = skill.getTypeForPlayers();
    typeForGoaltenders = skill.getTypeForGoaltenders();
    name = skill.getName();
    number = skill.getNumber();
    tournament = skill.getTournament();
  }

}
