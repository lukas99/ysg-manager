package com.lukas99.ysgmanager.domain;

import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A skill.
 */
@Entity
@Table
@Data
@EqualsAndHashCode(callSuper = false)
public class Skill extends Auditable {

  @Id
  private Long id;

  @Column(name = "type")
  private SkillType skillType;

  private String name;

  /**
   * The number to order the skills between each others.
   */
  private Integer number;

  @ManyToOne
  private Tournament tournament;

  @OneToMany(mappedBy = "skill")
  private List<SkillRating> ratings;

  @OneToMany(mappedBy = "skill")
  private List<SkillResult> results;

}
