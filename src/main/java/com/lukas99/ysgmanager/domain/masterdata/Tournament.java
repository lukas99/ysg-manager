package com.lukas99.ysgmanager.domain.masterdata;

import java.util.Date;
import java.util.List;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import lombok.Data;

/**
 * A hockey tournament.
 */
@Entity
@Table
@Data
public class Tournament {

  @Id
  private Long id;

  private String name;

  private String dateDescription;
  
  @OneToMany(mappedBy = "tournament")
  private List<Team> teams;
  
  @OneToMany(mappedBy = "tournament")
  private List<Skill> skills;

  @CreatedDate
  private Date created;

  @LastModifiedDate
  private Date modified;

}
