package com.lukas99.ysgmanager.domain.masterdata;

import java.util.List;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A team which participates at a tournament.
 */
@Entity
@Table
@Data
@EqualsAndHashCode(callSuper = false)
public class Team extends Auditable {

  @Id
  private Long id;

  private String name;

  private byte[] logo;

  @ManyToOne
  private Tournament tournament;

  @OneToMany
  private List<Player> players;

}
