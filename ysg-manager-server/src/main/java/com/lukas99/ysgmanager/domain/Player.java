package com.lukas99.ysgmanager.domain;

import jakarta.persistence.GenerationType;
import jakarta.persistence.SequenceGenerator;
import java.util.List;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
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
 * A hockey player.
 */
@Entity
@Table
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@EqualsAndHashCode(callSuper = false)
public class Player extends Auditable {

  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "hibernate_sequence")
  @SequenceGenerator(name = "hibernate_sequence", allocationSize = 1)
  private Long id;

  private String firstName;

  private String lastName;

  @NotNull
  private Integer shirtNumber;

  @NotNull
  @Enumerated(EnumType.STRING)
  private PlayerPosition position;

  @NotNull
  @ManyToOne
  private Team team;

  @OneToMany(mappedBy = "player")
  @ToString.Exclude
  private List<SkillRating> skillRatings;

  @OneToMany(mappedBy = "player")
  @ToString.Exclude
  private List<SkillResult> skillResults;

  public void update(Player player) {
    firstName = player.getFirstName();
    lastName = player.getLastName();
    shirtNumber = player.getShirtNumber();
    position = player.getPosition();
    team = player.getTeam();
  }

}
