package com.lukas99.ysgmanager.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import java.util.List;
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
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "hibernate_sequence")
  @SequenceGenerator(name = "hibernate_sequence", allocationSize = 1)
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
    tournamentRankingPlayerPosition = skill.getTournamentRankingPlayerPosition();
    name = skill.getName();
    number = skill.getNumber();
    tournament = skill.getTournament();
  }

}
