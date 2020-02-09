package com.lukas99.ysgmanager.domain;

import java.util.List;
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
 * A team which participates at a tournament.
 */
@Entity
@Table
@Data
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

}
