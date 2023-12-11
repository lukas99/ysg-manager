package com.lukas99.ysgmanager.domain;

import jakarta.persistence.GenerationType;
import jakarta.persistence.SequenceGenerator;
import java.util.List;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

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
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "hibernate_sequence")
  @SequenceGenerator(name = "hibernate_sequence", allocationSize = 1)
  private Long id;

  @NotNull
  private String name;

  private String dateDescription;

  private boolean active;

  @OneToMany(mappedBy = "tournament")
  @ToString.Exclude
  private List<Team> teams;

  @OneToMany(mappedBy = "tournament")
  @ToString.Exclude
  private List<Skill> skills;

  /**
   * Updates this tournament with the given tournament.
   *
   * @param tournament The tournament to use for update.
   */
  public void update(Tournament tournament) {
    this.name = tournament.getName();
    this.dateDescription = tournament.getDateDescription();
    this.active = tournament.isActive();
  }

}
