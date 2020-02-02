package com.lukas99.ysgmanager.domain;

import java.util.List;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A hockey player.
 */
@Entity
@Table
@Data
@EqualsAndHashCode(callSuper = false)
public class Player extends Auditable {

  @Id
  @GeneratedValue
  private Long id;

  private String firstName;

  private String lastName;

  private Integer shirtNumber;

  private PlayerPosition position;

  @ManyToOne
  private Team team;

  @OneToMany(mappedBy = "player")
  private List<SkillRating> skillRatings;

  @OneToMany(mappedBy = "player")
  private List<SkillResult> skillResults;

}
