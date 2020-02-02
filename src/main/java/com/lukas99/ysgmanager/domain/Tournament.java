package com.lukas99.ysgmanager.domain;

import java.util.List;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * A hockey tournament.
 */
@Entity
@Table
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@EqualsAndHashCode(callSuper = false)
public class Tournament extends Auditable {

  @Id
  @GeneratedValue
  private Long id;

  @NotNull
  private String name;

  private String dateDescription;

  @OneToMany(mappedBy = "tournament")
  private List<Team> teams;

  @OneToMany(mappedBy = "tournament")
  private List<Skill> skills;

  /**
   * Updates this tournament with the given tournament.
   * 
   * @param tournament The tournament to use for update.
   */
  public void update(Tournament tournament) {
    this.name = tournament.getName();
    this.dateDescription = tournament.getDateDescription();
    this.teams = tournament.getTeams();
    this.skills = tournament.getSkills();
  }

}
