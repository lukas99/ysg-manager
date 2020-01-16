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
import lombok.EqualsAndHashCode;

/**
 * A hockey player.
 */
@Entity
@Table
@Data
@EqualsAndHashCode(callSuper = false)
public class Player extends Auditable {

  @Id
  private Long id;

  private String firstName;

  private String lastName;

  private Integer shirtNumber;

  private PlayerPosition position;

  @ManyToOne
  private Team team;

  @OneToMany(mappedBy = "player")
  private List<SkillRating> skillRatings;

  @OneToMany(mappedBy = "player")
  private List<SkillResult> skillResults;

}
