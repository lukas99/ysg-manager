package com.lukas99.ysgmanager.domain.masterdata;

import java.util.Date;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import lombok.Data;

/**
 * The rating of a player for a skill provided by a skill expert.
 */
@Entity
@Table
@Data
public class SkillRating {
  
  @Id
  private Long id;
  
  @ManyToOne
  private Skill skill;
  
  @ManyToOne
  private Player player;
  
  /**
   * The score given by a skill expert.
   */
  private Integer score;
  
  @CreatedDate
  private Date created;

  @LastModifiedDate
  private Date modified;

}
