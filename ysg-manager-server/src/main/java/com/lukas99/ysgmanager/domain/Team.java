package com.lukas99.ysgmanager.domain;

import jakarta.persistence.GenerationType;
import jakarta.persistence.SequenceGenerator;
import java.util.List;
import jakarta.persistence.Entity;
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
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "hibernate_sequence")
  @SequenceGenerator(name = "hibernate_sequence", allocationSize = 1)
  private Long id;

  @NotNull
  private String name;

  private byte[] logo;

  @NotNull
  @ManyToOne
  private Tournament tournament;

  @OneToMany(mappedBy = "team")
  @ToString.Exclude
  private List<Player> players;

  public void update(Team team) {
    name = team.getName();
    logo = team.getLogo();
    tournament = team.getTournament();
  }

}
