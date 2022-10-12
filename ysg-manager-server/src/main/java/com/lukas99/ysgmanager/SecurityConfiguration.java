package com.lukas99.ysgmanager;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

/**
 * Configure application to be an OAuth 2.0 resource server which looks for an Authorization header
 * with an access token in it.
 */
@Configuration
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http.authorizeRequests()
        .antMatchers("/", "/index.html", "/**.js", "/**.css").permitAll()
        .antMatchers("manifest.webmanifest", "ngsw.json").permitAll() // to support PWA
        .antMatchers("/api/v1/application").permitAll()
        /*
          In Okta, add 2 'groups' claims (Access Token & ID Token) and add the applications to
          the corresponding groups. See:
          https://developer.okta.com/blog/2019/06/20/spring-preauthorize
          Use @EnableGlobalMethodSecurity(prePostEnabled = true) in case @PreAuthorize
          should be used on REST controller methods.
         */
        .antMatchers("/api/v1/secure").hasAuthority("ysg-admins")
        .anyRequest().authenticated()
        // enable OAuth2/OIDC
        .and().oauth2Login()
        .and().oauth2ResourceServer().jwt();
  }

  /**
   * In order for your Angular app (on port 4200) to communicate with your Spring Boot app (on port
   * 8080), we have to enable CORS (cross-origin resource sharing).
   *
   * @return The CORS filter registration bean.
   */
  @Bean
  public FilterRegistrationBean<CorsFilter> simpleCorsFilter() {
    var source = new UrlBasedCorsConfigurationSource();
    var config = new CorsConfiguration();
    config.setAllowCredentials(true);
    config.addAllowedOrigin("http://localhost:4200");
    config.addAllowedMethod("*");
    config.addAllowedHeader("*");
    source.registerCorsConfiguration("/**", config);
    var bean = new FilterRegistrationBean<>(new CorsFilter(source));
    bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
    return bean;
  }

}
