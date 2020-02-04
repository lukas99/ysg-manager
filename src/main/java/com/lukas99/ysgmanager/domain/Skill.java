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
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A skill.
 */
@Entity
@Table
@Data
@Builder(toBuilder = true)
@EqualsAndHashCode(callSuper = false)
public class Skill extends Auditable {

  @Id
  @GeneratedValue
  private Long id;

  @NotNull
  @Column(name = "type")
  private SkillType skillType;

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
  private List<SkillRating> ratings;

  @OneToMany(mappedBy = "skill")
  private List<SkillResult> results;

  public void update(Skill skill) {
    skillType = skill.getSkillType();
    name = skill.getName();
    number = skill.getNumber();
    tournament = skill.getTournament();
  }

}
