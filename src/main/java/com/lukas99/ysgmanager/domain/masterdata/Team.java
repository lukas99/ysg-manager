package com.lukas99.ysgmanager.domain.masterdata;

import java.util.Date;
import java.util.List;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import lombok.Data;

/**
 * A team which participates at a tournament.
 */
@Entity
@Table
@Data
public class Team {

  @Id
  private Long id;
  
  private String name;
  
  private byte[] logo;
  
  @ManyToOne
  private Tournament tournament;
  
  @OneToMany
  private List<Player> players;

  @CreatedDate
  private Date created;

  @LastModifiedDate
  private Date modified;
  
}
