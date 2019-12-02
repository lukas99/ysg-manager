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
 * The result of a player for a skill execution.
 */
@Entity
@Table
@Data
public class SkillResult {
  
  @Id
  private Long id;
  
  @ManyToOne
  private Skill skill;
  
  @ManyToOne
  private Player player;
  
  /**
   * The execution time as milliseconds.
   */
  private Integer time;
  
  /**
   * The amount of failures made during execution.
   */
  private Integer failures;
  
  /**
   * The amount of points achieved during execution.
   */
  private Integer points;
  
  @CreatedDate
  private Date created;

  @LastModifiedDate
  private Date modified;

}
