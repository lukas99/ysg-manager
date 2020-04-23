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
 * A team which participates at a tournament.
 */
@Entity
@Table
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@EqualsAndHashCode(callSuper = false)
public class Team extends Auditable {

  @Id
  @GeneratedValue
  private Long id;

  @NotNull
  private String name;

  private byte[] logo;

  @NotNull
  @ManyToOne
  private Tournament tournament;

  @OneToMany
  private List<Player> players;

  public void update(Team team) {
    name = team.getName();
    logo = team.getLogo();
    tournament = team.getTournament();
  }

}
