package com.lukas99.ysgmanager;

import static org.springframework.security.config.Customizer.withDefaults;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

/**
 * Configure application to be an OAuth 2.0 resource server which looks for an Authorization header
 * with an access token in it.
 */
@Configuration
public class SecurityConfiguration {

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    return http
        // disable CSRF protection for now, otherwise POST requests do not work with https
        .csrf(AbstractHttpConfigurer::disable)
        .authorizeHttpRequests(customizer -> customizer
            .requestMatchers("/", "/index.html", "/**.js", "/**.css", "/favicon.ico",
                "/assets/images/**.jpg", "/assets/i18n/**.json").permitAll()
            // to support PWA
            .requestMatchers("/manifest.webmanifest", "/ngsw.json").permitAll()
            .anyRequest().authenticated()
        )
        // enable OAuth2/OIDC
        .oauth2Login(withDefaults())
        .oauth2ResourceServer(customizer -> customizer.jwt(withDefaults()))
        .build();
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
    // also add origins to auth.interceptor.ts and to Keycloak Client configuration
    config.addAllowedOrigin("http://localhost:4200");
    config.addAllowedOrigin("https://ysg-manager-server-24h6rzjfpa-ew.a.run.app");
    config.addAllowedOrigin("https://ysg-manager--k8vb2jl.jollydesert-aef2d738.northeurope.azurecontainerapps.io");
    config.addAllowedMethod("*");
    config.addAllowedHeader("*");
    source.registerCorsConfiguration("/**", config);
    var bean = new FilterRegistrationBean<>(new CorsFilter(source));
    bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
    return bean;
  }

}
