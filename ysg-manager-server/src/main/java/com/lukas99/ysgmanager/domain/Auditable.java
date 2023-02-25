package com.lukas99.ysgmanager.domain;

import java.util.Date;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

/**
 * Superclass providing auditing information for tables.
 */
@Getter(AccessLevel.PROTECTED)
@Setter(AccessLevel.PROTECTED)
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public class Auditable {

  @CreatedBy
  private String createdBy;

  @CreatedDate
  private Date created;

  @LastModifiedBy
  private String modifiedBy;

  @LastModifiedDate
  private Date modified;

}
