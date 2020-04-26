package com.lukas99.ysgmanager;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.Optional;

/**
 * Configures JPA auditing. Provides the user name for the auditing information (createdBy / modifiedBy).
 */
@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorProvider")
public class JpaAuditingConfiguration {

  /**
   * @return The user name of the user which is currently logged in.
   */
  @Bean
  public AuditorAware<String> auditorProvider() {
    return () -> Optional.of(SecurityContextHolder.getContext().getAuthentication().getName());
  }

}

