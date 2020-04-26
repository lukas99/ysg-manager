package com.lukas99.ysgmanager.domain;

import java.util.List;
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
  @GeneratedValue
  private Long id;

  private String firstName;

  private String lastName;

  @NotNull
  private Integer shirtNumber;

  @NotNull
  private PlayerPosition position;

  @NotNull
  @ManyToOne
  private Team team;

  @OneToMany(mappedBy = "player")
  private List<SkillRating> skillRatings;

  @OneToMany(mappedBy = "player")
  private List<SkillResult> skillResults;

  public void update(Player player) {
    firstName = player.getFirstName();
    lastName = player.getLastName();
    shirtNumber = player.getShirtNumber();
    position = player.getPosition();
    team = player.getTeam();
  }

}
