package com.lukas99.ysgmanager;

import org.keycloak.adapters.KeycloakConfigResolver;
import org.keycloak.adapters.springboot.KeycloakSpringBootConfigResolver;
import org.keycloak.adapters.springsecurity.KeycloakConfiguration;
import org.keycloak.adapters.springsecurity.authentication.KeycloakAuthenticationProvider;
import org.keycloak.adapters.springsecurity.config.KeycloakWebSecurityConfigurerAdapter;
import org.keycloak.adapters.springsecurity.filter.KeycloakAuthenticationProcessingFilter;
import org.keycloak.adapters.springsecurity.management.HttpSessionManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.authority.mapping.SimpleAuthorityMapper;
import org.springframework.security.web.authentication.session.NullAuthenticatedSessionStrategy;
import org.springframework.security.web.authentication.session.SessionAuthenticationStrategy;

/**
 * Keycloak configuration. Adjust configure method to define permissions.
 */
@KeycloakConfiguration
public class SecurityConfiguration extends KeycloakWebSecurityConfigurerAdapter {

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    super.configure(http);
    http.authorizeRequests()
        .antMatchers("/", "/index.html", "/**.js", "/**.css").permitAll()
        .antMatchers("/api/v1/application").permitAll()
        .antMatchers("/api/v1/secure").hasRole("YSG_ADMIN")
        .anyRequest().authenticated();
  }

  @Autowired
  public void configureGlobal(AuthenticationManagerBuilder auth) {
    // use SimpleAuthorityMapper to allow roles in Keycloak to be defined without prefix "ROLE_"
    KeycloakAuthenticationProvider keycloakAuthProvider = keycloakAuthenticationProvider();
    keycloakAuthProvider.setGrantedAuthoritiesMapper(new SimpleAuthorityMapper());
    auth.authenticationProvider(keycloakAuthProvider);
  }

  @Bean
  @Override
  protected SessionAuthenticationStrategy sessionAuthenticationStrategy() {
    // no session
    return new NullAuthenticatedSessionStrategy();
  }

  @Bean
  public KeycloakConfigResolver KeycloakConfigResolver() {
    // By Default, the Spring Security Adapter looks for a keycloak.json configuration file. You can
    // make sure it looks at the configuration provided by the Spring Boot Adapter by adding this
    // bean
    return new KeycloakSpringBootConfigResolver();
  }

  @Bean
  public FilterRegistrationBean<KeycloakAuthenticationProcessingFilter> keycloakAuthenticationProcessingFilterRegistrationBean(
      KeycloakAuthenticationProcessingFilter filter) {
    // Spring Boot attempts to eagerly register filter beans with the web application context.
    // Therefore, when running the Keycloak Spring Security adapter in a Spring Boot environment, it
    // may be necessary to add FilterRegistrationBeans to your security configuration to prevent the
    // Keycloak filters from being registered twice.
    // http://www.keycloak.org/docs/latest/securing_apps/index.html#avoid-double-filter-bean-registration
    FilterRegistrationBean<KeycloakAuthenticationProcessingFilter> registrationBean =
        new FilterRegistrationBean<>(filter);
    registrationBean.setEnabled(false);
    return registrationBean;
  }

  @Bean
  @Override
  @ConditionalOnMissingBean(HttpSessionManager.class)
  protected HttpSessionManager httpSessionManager() {
    // Spring Boot 2.1 also disables spring.main.allow-bean-definition-overriding by default. This
    // can mean that an BeanDefinitionOverrideException will be encountered if a Configuration class
    // extending KeycloakWebSecurityConfigurerAdapter registers a bean that is already detected by a
    // @ComponentScan. This can be avoided by overriding the registration to use the Boot-specific
    // @ConditionalOnMissingBean annotation, as with HttpSessionManager below.
    return new HttpSessionManager();
  }

}
