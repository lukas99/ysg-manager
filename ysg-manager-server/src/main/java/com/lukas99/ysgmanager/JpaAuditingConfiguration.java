package com.lukas99.ysgmanager;

import java.security.Principal;
import java.util.Optional;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * Configures JPA auditing. Provides the user name for the auditing information (createdBy /
 * modifiedBy).
 */
@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorProvider")
public class JpaAuditingConfiguration {

  private static final String ANONYMOUS_USER_NAME = "system";

  /**
   * @return The user name of the user which is currently logged in.
   */
  @Bean
  public AuditorAware<String> auditorProvider() {
    return () -> Optional.of(
        Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
            .map(Principal::getName)
            // provide default value for async logic
            .orElse(ANONYMOUS_USER_NAME)
    );
  }

}

