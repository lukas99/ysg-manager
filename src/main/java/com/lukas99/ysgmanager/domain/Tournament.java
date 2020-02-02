package com.lukas99.ysgmanager.domain;

import java.util.List;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A hockey tournament.
 */
@Entity
@Table
@Data
@EqualsAndHashCode(callSuper = false)
public class Tournament extends Auditable {

  @Id
  @GeneratedValue
  private Long id;

  private String name;

  private String dateDescription;

  @OneToMany(mappedBy = "tournament")
  private List<Team> teams;

  @OneToMany(mappedBy = "tournament")
  private List<Skill> skills;

}
